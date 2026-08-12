



echo "=== 1. master.cf - pipe vaultkeeper-forward ==="
grep -A1 "vaultkeeper-forward" /etc/postfix/master.cf 2>/dev/null || echo "Non trouvé"

echo ""
echo "=== 2. main.cf - transport_maps ==="
postconf transport_maps 2>/dev/null || true

echo ""
echo "=== 3. Fichier transport ==="
cat /etc/postfix/transport 2>/dev/null || echo "Fichier absent"
echo ""
postmap -q vaultkeepr.xyz /etc/postfix/transport 2>/dev/null || echo "Aucun mapping pour vaultkeepr.xyz"

echo ""
echo "=== 4. virtual_mailbox_domains / mydestination ==="
postconf mydestination virtual_mailbox_domains 2>/dev/null || true

echo ""
echo "=== 5. Activer le debug ==="
echo "Dans /usr/local/bin/vaultkeeper-forward.sh, ajouter avant exec:"
echo '  export VAULTKEEPER_FORWARD_DEBUG=1'
echo "Puis envoyer un mail vers ton alias et lire: cat /tmp/vaultkeeper-forward.log"

echo ""
echo "=== 6. Dernières lignes mail.log ==="
tail -20 /var/log/mail.log 2>/dev/null || tail -20 /var/log/maillog 2>/dev/null || echo "Log non accessible"
