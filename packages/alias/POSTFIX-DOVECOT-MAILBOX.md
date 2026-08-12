# Boîte mail réelle (`support@`) sur le même serveur que les alias

Ce guide ajoute **une boîte IMAP** (ex. `support@vaultkeepr.xyz`) sur la machine qui exécute déjà Postfix + le pipe VaultKeepR, **sans** mettre tout le domaine en `virtual_mailbox_domains` (ce qui casserait les alias dynamiques).

**Prérequis :** installer Dovecot avant toute commande `doveadm` (ex. Debian/Ubuntu : `sudo apt install dovecot-core dovecot-imapd` ; ajouter `dovecot-lmtpd` pour LMTP).

### Ubuntu / Debian : activer `passwd-file` (sinon « No passdbs »)

L’image par défaut charge souvent **PAM** via `!include auth-system.conf.ext` et laisse **`auth-passwdfile.conf.ext`** commenté ou non inclus. Si tu désactives PAM sans activer `passwd-file`, les logs affichent **`No passdbs specified`** et **`Couldn't connect to auth socket`**.

1. Dans **`/etc/dovecot/conf.d/10-auth.conf`** : commenter **`!include auth-system.conf.ext`** et ajouter (si absent) **`!include auth-passwdfile.conf.ext`**.
2. Dans **`/etc/dovecot/conf.d/auth-passwdfile.conf.ext`** : décommenter ou coller les blocs **`passdb` / `userdb`** (voir §2 ci-dessous), pas seulement des exemples commentés.
3. Vérifier : **`sudo doveconf -n | grep -A12 passdb`** → doit montrer **`driver = passwd-file`**.
4. **`sudo systemctl restart dovecot`** (un simple `reload` ne suffit pas toujours après une erreur `auth`).

## Principe

- **`transport_maps`** : Postfix résout d’abord l’adresse **complète**, puis le domaine.
  - `support@vaultkeepr.xyz` → **LMTP** vers Dovecot (stockage Maildir).
  - `vaultkeepr.xyz` → **`vaultkeeper-forward:`** (inchangé pour le reste).
- **Dovecot** : IMAPS (lecture dans Mail macOS), LMTP (réception depuis Postfix), authentification SMTP (envoi).

Adapte les chemins, domaine et noms d’utilisateur système (`vmail`) à ton OS.

---

## 1. Utilisateur et répertoire Maildir

```bash
sudo groupadd -g 5000 vmail 2>/dev/null || true
sudo useradd -g vmail -u 5000 vmail -d /var/mail/vhosts -m 2>/dev/null || true

sudo mkdir -p /var/mail/vhosts/vaultkeepr.xyz/support
sudo chown -R vmail:vmail /var/mail/vhosts
```

---

## 2. Mot de passe de la boîte `support`

```bash
sudo doveadm pw -s BLF-CRYPT
# Coller le hash affiché dans le fichier passdb ci-dessous
```

Fichier **`/etc/dovecot/users`** (permissions root:root 640), une ligne par compte :

```
support@vaultkeepr.xyz:{BLF-CRYPT}$2y$05$...hash_généré_par_doveadm_pw...
```

Le `userdb` statique ci-dessous fournit `home` ; avec `mail_location = maildir:/var/mail/vhosts/%d/%n`, les messages vont dans `/var/mail/vhosts/vaultkeepr.xyz/support`.

Exemple minimal **`/etc/dovecot/conf.d/auth-passwdfile.conf.ext`** :

```
passdb {
  driver = passwd-file
  args = scheme=BLF-CRYPT username_format=%u /etc/dovecot/users
}
userdb {
  driver = static
  args = uid=vmail gid=vmail home=/var/mail/vhosts/%d/%n
}
```

Et dans **`/etc/dovecot/conf.d/10-mail.conf`** :

```
mail_location = maildir:/var/mail/vhosts/%d/%n
mail_uid = vmail
mail_gid = vmail
```

---

## 3. Dovecot : IMAP + LMTP

**`/etc/dovecot/conf.d/10-master.conf`** (extraits) :

```
service imap-login {
  inet_listener imaps {
    port = 993
    ssl = yes
  }
}

service lmtp {
  unix_listener /var/spool/postfix/private/dovecot-lmtp {
    mode = 0600
    user = postfix
    group = postfix
  }
}
```

Active LMTP dans **`/etc/dovecot/conf.d/20-lmtp.conf`** :

```
protocol lmtp {
  postmaster_address = postmaster@vaultkeepr.xyz
  mail_plugins = $mail_plugins
}
```

TLS : utilise les certificats Let’s Encrypt du host (ex. `mail.vaultkeepr.xyz` ou le FQDN du serveur) dans **`/etc/dovecot/conf.d/10-ssl.conf`** :

```
ssl = yes
ssl_cert = </etc/letsencrypt/live/mail.vaultkeepr.xyz/fullchain.pem
ssl_key = </etc/letsencrypt/live/mail.vaultkeepr.xyz/privkey.pem
```

Puis :

```bash
sudo systemctl enable dovecot
sudo systemctl restart dovecot
```

---

## 4. Postfix : router `support@` vers Dovecot

Dans **`/etc/postfix/main.cf`**, ajoute (ou complète) **`transport_maps`** en conservant le fichier `transport` existant pour le domaine.

**Option recommandée** : un fichier dédié **plus prioritaire** pour l’adresse exacte.

```
transport_maps = hash:/etc/postfix/transport_recipient, hash:/etc/postfix/transport
```

**`/etc/postfix/transport_recipient`** (une ligne) :

```
support@vaultkeepr.xyz    lmtp:unix:private/dovecot-lmtp
```

**`/etc/postfix/transport`** (inchangé pour les alias) :

```
vaultkeepr.xyz    vaultkeeper-forward:
```

```bash
sudo postmap /etc/postfix/transport_recipient
sudo postmap /etc/postfix/transport
sudo postfix reload
```

Vérifie que le socket existe :

```bash
ls -la /var/spool/postfix/private/dovecot-lmtp
```

---

## 5. Envoi depuis Mail (macOS) — SMTP authentifié

L’erreur **`Relay access denied`** dans Mail signifie presque toujours : Postfix **n’a pas accepté l’authentification SASL** (socket Dovecot manquant / mauvais `main.cf`) **ou** Mail envoie sur le **port 25** sans auth au lieu du **587** avec identifiants.

### 5.1 Dovecot : socket `auth` pour Postfix

**Méthode recommandée (évite les doublons et les plantages au démarrage)** :

1. Remettre le **`10-master.conf` du paquet** (fichier sain, comme sur une install neuve) :

   ```bash
   sudo cp /usr/share/dovecot/conf.d/10-master.conf /etc/dovecot/conf.d/10-master.conf
   ```

2. Activer **IMAPS** si besoin : dans ce même fichier, décommenter sous **`service imap-login`** les lignes **`port = 993`** et **`ssl = yes`** du bloc **`inet_listener imaps`** (une seule définition **`imaps`** dans tout **`conf.d/`**).

3. Ajouter **uniquement** les sockets Postfix via le snippet du dépôt :

   - **`packages/alias/examples/dovecot/99-postfix-dovecot.conf`** → copier vers **`/etc/dovecot/conf.d/99-postfix-dovecot.conf`**.

4. Vérifier qu’il n’y a **pas deux fois** le même socket :

   ```bash
   grep -r 'private/auth\|dovecot-lmtp' /etc/dovecot/conf.d/
   ```

   Tu dois voir **au plus une** ligne active **`unix_listener /var/spool/postfix/private/auth`** et **une** pour **`dovecot-lmtp`** (si tu utilises le snippet, retire ou commente tout doublon dans d’autres fichiers).

5. Valider et relancer :

   ```bash
   sudo doveconf -n >/dev/null && sudo systemctl restart dovecot
   ```

**Si `systemctl restart dovecot` échoue encore :** **`sudo doveconf`** ou **`sudo journalctl -u dovecot -n 40 --no-pager`** — erreurs fréquentes : **`listen\(...\) failed: Address already in use`**, **`already defined`**, accolade manquante.

**`Garbage after '{'` sur `10-master.conf` :** souvent un bloc **`service … { }` vide** (sans aucune ligne à l’intérieur, même commentée). Mettre au moins une ligne commentée dans le bloc, ou reprendre le fichier du paquet + snippet **`99-postfix-dovecot.conf`**.

**Alternative :** fichier **`10-master.conf` complet** dans **`packages/alias/examples/dovecot/10-master.conf`** (remplace celui du paquet) — à n’utiliser que si **`grep -r`** ne montre **aucun** autre `imap-login` / `private/auth` / `dovecot-lmtp` ailleurs.

Vérifie : **`ls -la /var/spool/postfix/private/auth`** → propriétaire **postfix**, mode **srw-rw----** (ou équivalent).

### 5.2 Postfix : SASL Dovecot (`main.cf`)

Ajoute (une seule fois, pas en doublon) :

```
smtpd_sasl_type = dovecot
smtpd_sasl_path = private/auth
smtpd_sasl_auth_enable = yes
smtpd_sasl_security_options = noanonymous
broken_sasl_auth_clients = yes
```

### 5.3 Postfix : service **submission** (587)

Dans **`/etc/postfix/master.cf`**, la section **`submission`** doit être **active** (pas commentée) et **autoriser explicitement** les clients authentifiés à relayer. Exemple type Debian/Ubuntu (adapter si tu as déjà des `-o` en conflit) :

```
submission inet n       -       y       -       -       smtpd
  -o syslog_name=postfix/submission
  -o smtpd_tls_security_level=encrypt
  -o smtpd_sasl_auth_enable=yes
  -o smtpd_tls_auth_only=yes
  -o smtpd_relay_restrictions=permit_sasl_authenticated,reject
  -o smtpd_recipient_restrictions=permit_sasl_authenticated,reject
  -o milter_macro_daemon_name=ORIGINATING
```

Puis : **`sudo systemctl restart postfix`** (ou au minimum **`postfix reload`** si seul `master.cf` change — un **restart** est plus sûr après la première mise en place du 587).

Pare-feu : **`ufw allow 587/tcp`** si besoin.

### 5.4 Mail (macOS)

- Serveur sortant : **même hôte** que l’IMAP (ex. `mail.vaultkeepr.xyz`).
- Port **587**, **STARTTLS** (ou « TLS » selon l’intitulé du panneau).
- **Authentification** : oui, **même adresse et mot de passe** que la boîte **`support@vaultkeepr.xyz`**.
- Ne pas utiliser le port **25** pour l’envoi client.

### 5.5 Test depuis le serveur (optionnel)

```bash
# Vérifier que Postfix écoute sur 587
ss -tlnp | grep ':587'

# Test SASL (si swaks installé)
# swaks --server mail.vaultkeepr.xyz --port 587 --tls --auth PLAIN \
#   --auth-user 'support@vaultkeepr.xyz' --auth-password '...' -t test@example.com
```

---

## 6. DNS (Cloudflare)

- **MX** : inchangé (ton serveur alias).
- **A** (ou **AAAA**) : `mail.vaultkeepr.xyz` → IP du serveur (pour TLS client et simplicité dans Mail).
- **SPF** : garde une ligne cohérente avec l’IP qui **envoie** (ton serveur si tu envoies depuis Postfix).
- **DKIM** : recommandé pour la délivrabilité (OpenDKIM ou rspamd + clé TXT dans Cloudflare).

---

## 7. Mail sur macOS

| Champ   | Valeur |
|--------|--------|
| Type   | Compte mail « Autre » |
| Adresse | `support@vaultkeepr.xyz` |
| IMAP   | `mail.vaultkeepr.xyz`, port **993**, SSL activé |
| SMTP   | même hôte, port **587**, STARTTLS, même identifiant / mot de passe |

---

## 8. Vérifications

```bash
# Depuis l’extérieur ou le serveur
openssl s_client -connect mail.vaultkeepr.xyz:993 -quiet
```

Envoi d’un mail de test vers `support@vaultkeepr.xyz` : le message doit apparaître sous `/var/mail/vhosts/vaultkeepr.xyz/support`. Les autres adresses du domaine continuent de passer par **`vaultkeeper-forward`**.

---

## Dépannage

| Problème | Piste |
|----------|--------|
| `User unknown` pour `support@` | Hash `transport_recipient` non postmap / mauvais ordre dans `transport_maps` |
| LMTP « Permission denied » | Droits `postfix` sur `private/dovecot-lmtp`, user/group dans Dovecot |
| IMAP refuse le login | Fichier `/etc/dovecot/users`, schéma BLF-CRYPT, `mail_location` |
| **Relay access denied** / pas d’envoi depuis Mail | **`main.cf`** : SASL Dovecot (§5.2) ; **`master.cf`** : **`submission`** sur **587** (§5.3) ; pare-feu **587/tcp** ; Mail : **STARTTLS** + auth **`support@…`**, pas le port 25 |
| Mail « parti » côté Mac mais **jamais reçu** | File d’attente : **`mailq`** / **`postqueue -p`** ; logs **`mail.log`** (`status=deferred`, timeout, **port 25**). Souvent **sortie SMTP 25 bloquée** par l’hébergeur → contacter le support ou smarthost. Vérifier **courrier indésirable** chez le destinataire. |
| Alias cassés | Ne **pas** mettre `vaultkeepr.xyz` dans `virtual_mailbox_domains` pour tout le domaine |

Pour le contexte VaultKeepR uniquement (pipe, `transport`), voir **`POSTFIX.md`**.
