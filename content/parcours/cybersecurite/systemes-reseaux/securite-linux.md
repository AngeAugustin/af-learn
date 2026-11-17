---
title: Sécuriser un serveur Linux
description: Utilisateurs et permissions, sudo, SSH par clé, mises à jour, services minimaux, journaux, protections contre la force brute et mécanismes de confinement.
duration: 55
objectives:
  - Gérer utilisateurs, groupes et permissions selon le moindre privilège
  - Sécuriser l'accès SSH
  - Réduire la surface d'attaque et maintenir le système à jour
  - Exploiter les journaux pour détecter des comportements suspects
---

# Utilisateurs et permissions

Linux est un système **multi-utilisateur** : chaque processus s'exécute sous l'identité d'un utilisateur, et chaque fichier appartient à un utilisateur et à un groupe. L'utilisateur **root** a tous les droits : c'est précisément pourquoi on évite de l'utiliser directement.

## Lire les permissions

```bash
$ ls -l /etc/app/config.yml
-rw-r----- 1 app app-admins 1204 mars  2 10:14 /etc/app/config.yml
```

`-rw-r-----` se lit en trois groupes de trois caractères :

| Pour | Droits | Signification |
|---|---|---|
| Propriétaire (`app`) | `rw-` | lecture, écriture |
| Groupe (`app-admins`) | `r--` | lecture seule |
| Autres | `---` | aucun droit |

En notation octale : `r` = 4, `w` = 2, `x` = 1. Ici `640`.

```bash
chmod 640 /etc/app/config.yml        # rw-r-----
chown app:app-admins /etc/app/config.yml
chmod 600 ~/.ssh/id_ed25519           # clé privée : lisible par son seul propriétaire
```

> [!WARNING]
> `chmod 777` (tout le monde peut tout faire) n'est **jamais** une solution à un problème de permission : n'importe quel processus compromis pourrait alors modifier le fichier. Trouvez quel utilisateur a besoin de quel droit, et accordez exactement celui-là.

## Les bits spéciaux

Le bit **SUID** (`-rwsr-xr-x`) fait s'exécuter un programme avec les droits de son **propriétaire** (souvent root), quel que soit l'utilisateur qui le lance. Il est nécessaire pour quelques commandes (`passwd`, `sudo`), mais un programme SUID root vulnérable ou détourné permet une **élévation de privilèges**. Listez-les et vérifiez qu'aucun n'est inattendu :

```bash
find / -perm -4000 -type f 2>/dev/null
```

## sudo et le moindre privilège

`sudo` permet à un utilisateur autorisé d'exécuter des commandes avec des privilèges élevés, en **journalisant** chaque usage. On évite les connexions directes en root et on limite les droits sudo au nécessaire :

```text
# /etc/sudoers.d/deploiement  (toujours éditer avec : visudo -f /etc/sudoers.d/deploiement)
# L'utilisateur deploy peut uniquement redémarrer le service de l'application
deploy ALL=(root) NOPASSWD: /usr/bin/systemctl restart app.service
```

Chaque **service** tourne sous son propre utilisateur système, sans shell de connexion, avec des droits limités à ses fichiers.

# Sécuriser SSH

SSH est la porte d'entrée de l'administration : c'est aussi l'une des cibles les plus attaquées (tentatives automatisées de mots de passe en continu sur tout serveur exposé).

## Authentification par clé

```bash
# Sur votre poste : générer une paire de clés (protégez la clé privée par une phrase de passe)
ssh-keygen -t ed25519 -C "alice@poste-admin"
# Copier la clé publique sur le serveur
ssh-copy-id alice@serveur.exemple.fr
```

La clé **privée** reste sur votre poste, la clé **publique** est ajoutée au fichier `~/.ssh/authorized_keys` du serveur.

## Configuration du serveur

```text
# /etc/ssh/sshd_config.d/durcissement.conf
PermitRootLogin no
PasswordAuthentication no
KbdInteractiveAuthentication no
PubkeyAuthentication yes
AllowGroups ssh-users
MaxAuthTries 3
LoginGraceTime 30
X11Forwarding no
```

```bash
sudo sshd -t                     # vérifier la syntaxe AVANT de recharger
sudo systemctl reload ssh        # (sshd sur certaines distributions)
```

> [!CAUTION]
> Avant de désactiver les mots de passe, **vérifiez** dans une seconde session que la connexion par clé fonctionne. Gardez la première session ouverte pendant le test : sinon, une erreur de configuration peut vous enfermer dehors.

Compléments : limiter l'accès SSH par pare-feu au réseau d'administration ou à un bastion, et utiliser **fail2ban** pour bannir temporairement les adresses qui multiplient les échecs.

```video
url: https://www.youtube.com/watch?v=s-vhqtyUF4I
title: "How SSH Works | Keys, Encryption & Real-World Examples"
channel: "ByteMonk"
duration: "7:36"
lang: en
why: "Comment fonctionne SSH : échange de clés, chiffrement et authentification par clé publique."
```

# Réduire la surface d'attaque

## Les mises à jour

La majorité des compromissions de serveurs exploitent des vulnérabilités **déjà corrigées** par l'éditeur. Appliquez les mises à jour de sécurité rapidement :

```bash
sudo apt update && sudo apt upgrade        # Debian, Ubuntu
sudo dnf upgrade --security                # Fedora, RHEL et dérivés
```

Sur Debian et Ubuntu, `unattended-upgrades` installe automatiquement les mises à jour de sécurité. Planifiez les redémarrages nécessaires (mise à jour du noyau).

## Les services

Chaque service qui tourne est du code exploitable. Désinstallez ou désactivez ce qui ne sert pas :

```bash
systemctl list-units --type=service --state=running   # services en cours d'exécution
ss -tulpn                                             # ports en écoute
sudo systemctl disable --now cups.service             # désactiver un service inutile sur un serveur
```

## Le confinement

- **AppArmor** (Debian, Ubuntu) et **SELinux** (Red Hat, Fedora) sont des mécanismes de **contrôle d'accès obligatoire** : même compromis, un service ne peut accéder qu'aux fichiers et ressources prévus par son profil. Laissez-les **activés** plutôt que de les désactiver au premier problème.
- **systemd** permet de restreindre un service dans son fichier d'unité : `NoNewPrivileges=yes`, `ProtectSystem=strict`, `PrivateTmp=yes`, etc. `systemd-analyze security app.service` évalue l'exposition d'un service.

> [!TIP]
> L'**ANSSI** publie des recommandations de configuration d'un système GNU/Linux, et le **CIS** (*Center for Internet Security*) des guides de durcissement (*benchmarks*) par distribution. Des outils comme **Lynis** auditent automatiquement une machine par rapport à ces bonnes pratiques.

# Journaux et détection

Les journaux permettent de **détecter** une attaque et de **reconstituer** ce qui s'est passé.

```bash
journalctl -u ssh --since "1 hour ago"           # journaux du service SSH
sudo grep "Failed password" /var/log/auth.log | tail   # échecs d'authentification (Debian/Ubuntu)
last -a | head                                   # dernières connexions
sudo ausearch -k fichiers_sensibles              # événements auditd étiquetés
```

À surveiller en priorité : échecs et réussites de connexion (surtout aux heures inhabituelles ou depuis des adresses inhabituelles), utilisations de `sudo`, création d'utilisateurs, modifications de fichiers sensibles (`/etc/passwd`, `/etc/sudoers`, `authorized_keys`), nouveaux services ou tâches planifiées.

> [!IMPORTANT]
> Un attaquant qui obtient les droits root peut **effacer** les journaux locaux. Envoyez-les en continu vers un serveur central (module 7) : c'est la seule façon de garantir leur conservation.

# Exercices

## Exercice 1 : Permissions

Un fichier `/opt/app/.env` contenant les mots de passe de l'application a les permissions `-rw-rw-r--` et appartient à `root:root`. L'application tourne sous l'utilisateur `app`. Que corrigez-vous ?

<details>
<summary>Voir la solution</summary>

`r--` pour « autres » : **tous** les utilisateurs du serveur peuvent lire les secrets. Et l'application, qui tourne sous `app`, n'est ni propriétaire ni dans le groupe : elle lit le fichier grâce à ce droit « autres ». Correction :

```bash
chown root:app /opt/app/.env
chmod 640 /opt/app/.env     # root lit et écrit, le groupe app lit, les autres rien
```

(ou `chown app:app` et `chmod 600` si l'application doit être propriétaire.)

</details>

## Exercice 2 : Durcir SSH

Le fichier `sshd_config` d'un serveur exposé contient `PermitRootLogin yes` et `PasswordAuthentication yes`. Les journaux montrent des milliers d'échecs de connexion par jour. Décrivez votre plan, dans l'ordre.

<details>
<summary>Voir la solution</summary>

1. Créer un compte d'administration nominatif, membre d'un groupe `ssh-users`, avec droits `sudo`.
2. Déployer une **clé SSH** (ed25519, avec phrase de passe) pour ce compte.
3. **Tester** la connexion par clé dans une seconde session.
4. Configurer `PermitRootLogin no`, `PasswordAuthentication no`, `AllowGroups ssh-users`, vérifier avec `sshd -t`, recharger.
5. Restreindre le port SSH par pare-feu au réseau d'administration (ou bastion), installer fail2ban.
6. Vérifier dans les journaux qu'aucune connexion réussie suspecte n'a eu lieu avant le durcissement.

</details>

## Exercice 3 : Lire les journaux

Vous trouvez dans `auth.log` : 4 000 échecs pour l'utilisateur `admin` depuis la même adresse IP en une heure, suivis d'un `Accepted password for admin` depuis cette adresse. Que s'est-il probablement passé et que faites-vous ?

<details>
<summary>Voir la solution</summary>

Une attaque par **force brute** a probablement **réussi** : le mot de passe d'`admin` a été trouvé. C'est un **incident** de sécurité (module 7) : isoler le serveur (sans l'éteindre, pour préserver les preuves), alerter l'équipe de réponse, analyser ce qu'a fait l'attaquant après la connexion (commandes, fichiers modifiés, nouveaux comptes ou clés, tâches planifiées), changer les secrets, puis reconstruire le serveur proprement et appliquer le durcissement SSH.

</details>

# Sketchnote : l'essentiel à retenir

```sketchnote
title: Sécuriser un serveur Linux
center: Moins de droits, moins de services, des accès par clé, des mises à jour rapides et des journaux centralisés.
points:
  - icon: lock
    title: Permissions
    text: rwx pour propriétaire, groupe, autres ; jamais 777 ; surveiller les SUID.
  - icon: users
    title: sudo et comptes de service
    text: Pas de root direct, sudo limité et journalisé, un utilisateur par service.
  - icon: key
    title: SSH par clé
    text: Root interdit, mots de passe désactivés, accès filtré, tester avant de fermer.
  - icon: loop
    title: Mises à jour et services
    text: Correctifs rapides, services inutiles supprimés, AppArmor ou SELinux actifs.
  - icon: eye
    title: Journaux
    text: Connexions, sudo, comptes, fichiers sensibles ; envoyés vers un serveur central.
pitfall: Désactiver les mots de passe SSH sans avoir testé la clé, et se retrouver enfermé dehors.
remember: La plupart des serveurs compromis l'ont été par une faille déjà corrigée ou un mot de passe faible.
```
