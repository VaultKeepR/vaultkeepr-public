# Configuration Postfix pour VaultKeepR Alias

## 1. master.cf

Ajouter à `/etc/postfix/master.cf` :

```
vaultkeeper-forward unix - n n - - pipe
  flags=FR user=nobody argv=/usr/bin/node /chemin/absolu/vers/packages/alias/dist/forward.js ${recipient}
```

- `user=nobody` : exécuter avec un utilisateur non privilégié (créer un user dédié si besoin)
- Remplacer `/chemin/absolu/...` par le chemin réel du script
- L'argument `${recipient}` permet d'utiliser le destinataire de l'enveloppe (plus fiable que le header To: pour les Cci).

## 2. Variables d'environnement

Créer `/etc/postfix/vaultkeeper.env` (ou utiliser systemd) :

```
ALIAS_DOMAIN=vaultkeepr.xyz
DATABASE_URL=postgresql://user:pass@localhost:5432/vaultkeeper
SMTP_HOST=localhost
SMTP_PORT=25
```

Postfix n'injecte pas les env par défaut. Options :
- Utiliser `wrapper` script qui source l'env puis appelle node
- Ou passer les variables dans `master.cf` via `environment` (selon version Postfix)

Exemple wrapper `/usr/local/bin/vaultkeeper-forward.sh` :

```bash
#!/bin/sh
export ALIAS_DOMAIN=vaultkeepr.xyz
export DATABASE_URL=postgresql://...
exec /usr/bin/node /chemin/alias/dist/forward.js "$@"
```

Puis dans master.cf : `argv=/usr/local/bin/vaultkeeper-forward.sh ${recipient}`

## 3. main.cf

```
# Domaine à accepter (relay_domains = le pipe gère les destinataires via la DB)
relay_domains = vaultkeepr.xyz

# NE PAS mettre vaultkeepr.xyz dans mydestination ni virtual_mailbox_domains
# (virtual_mailbox_domains exige virtual_mailbox_maps → rejet "User unknown")

# Transport pour ce domaine
transport_maps = hash:/etc/postfix/transport
```

## 4. transport

Créer `/etc/postfix/transport` :

```
vaultkeepr.xyz    vaultkeeper-forward:
```

Puis : `postmap /etc/postfix/transport`

## 5. Vérifications

- Retirer `vaultkeepr.xyz` de `mydestination` et de `virtual_mailbox_domains` dans main.cf
- `postconf -e 'relay_domains = vaultkeepr.xyz'` (ou ajouter à la liste existante)
- Pour relay_domains, le serveur doit être le MX du domaine (permit_mx_backup)

## 6. MX et SPF

- MX de vaultkeepr.xyz → IP du serveur
- SPF : `v TXT "v=spf1 mx ~all"` (ou inclure l'IP)
- DKIM recommandé pour la délivrabilité

## 7. Relancer Postfix

```bash
systemctl reload postfix
```

## 8. Boîte mail réelle (IMAP / Mail macOS)

Pour ajouter une adresse fixe type **`support@vaultkeepr.xyz`** sur le **même serveur** que les alias, sans casser le transport `vaultkeeper-forward` sur le reste du domaine, voir **`POSTFIX-DOVECOT-MAILBOX.md`** (Postfix + Dovecot, LMTP).
