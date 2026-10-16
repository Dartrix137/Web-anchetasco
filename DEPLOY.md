# Guía de despliegue — Ancheta & Co.

Cómo funciona:

```
git push a main
  └─> GitHub Actions construye la imagen Docker (en GitHub, nunca en el VPS)
        └─> la sube a GHCR: ghcr.io/dartrix137/web-anchetasco:latest y :<sha>
              └─> entra por SSH al VPS (puerto 2222, usuario deploy)
                    └─> copia docker-compose.yml + Caddyfile a /home/deploy/app
                          └─> docker compose pull && up -d, recarga Caddy, docker image prune -f
```

| Dato | Valor |
|---|---|
| Servidor | `50.6.206.188`, usuario `deploy`, SSH en el puerto **2222** |
| Carpeta de la app | `/home/deploy/app` (`docker-compose.yml`, `Caddyfile`, `.env`) |
| Imagen | `ghcr.io/dartrix137/web-anchetasco` (tags `latest` y SHA corto del commit, p. ej. `a1b2c3d`) |
| Contenedores | `app` (Next.js, puerto 3000 solo en la red interna) y `caddy` (único que publica 80/443) |
| Base de datos | **No hay.** Las cotizaciones se envían por WhatsApp; la app no guarda datos. |

Archivos del repo implicados: `Dockerfile`, `.dockerignore`, `deploy/docker-compose.yml`, `deploy/Caddyfile`, `deploy/.env.example`, `.github/workflows/deploy.yml`.

---

## 1. Crear una llave SSH exclusiva para GitHub Actions

Usa una llave **nueva**, distinta de tu llave personal: si algún día se filtra, la revocas sin perder tu acceso.

En tu PC (PowerShell):

```powershell
ssh-keygen -t ed25519 -C "github-actions-anchetasco" -f "$HOME\.ssh\anchetasco_actions" -N '""'
```

Esto crea dos archivos:

- `C:\Users\<tú>\.ssh\anchetasco_actions` → **privada**. Va a GitHub Secrets. No la compartas ni la subas al repo.
- `C:\Users\<tú>\.ssh\anchetasco_actions.pub` → **pública**. Va al servidor.

Añade la **pública** al servidor (entras con tu llave personal, como siempre):

```powershell
Get-Content "$HOME\.ssh\anchetasco_actions.pub" | ssh -p 2222 deploy@50.6.206.188 "mkdir -p ~/.ssh && chmod 700 ~/.ssh && cat >> ~/.ssh/authorized_keys && chmod 600 ~/.ssh/authorized_keys"
```

Prueba que la llave nueva entra:

```powershell
ssh -i "$HOME\.ssh\anchetasco_actions" -p 2222 deploy@50.6.206.188 "echo ok && docker compose version"
```

## 2. Crear los secrets en GitHub

En GitHub: repo **Web-anchetasco → Settings → Secrets and variables → Actions → New repository secret**.

| Secret | Valor |
|---|---|
| `SSH_HOST` | `50.6.206.188` |
| `SSH_PORT` | `2222` |
| `SSH_USER` | `deploy` |
| `SSH_KEY` | El contenido **completo** de la llave privada, incluidas las líneas `-----BEGIN OPENSSH PRIVATE KEY-----` y `-----END OPENSSH PRIVATE KEY-----` |

Para copiar la privada al portapapeles:

```powershell
Get-Content "$HOME\.ssh\anchetasco_actions" -Raw | Set-Clipboard
```

El token para subir la imagen a GHCR **no hay que crearlo**: el workflow usa el `GITHUB_TOKEN` automático.

## 3. Preparar el servidor (solo la primera vez)

Entra al servidor:

```bash
ssh -p 2222 deploy@50.6.206.188
```

Crea la carpeta y el `.env`:

```bash
mkdir -p /home/deploy/app
cd /home/deploy/app
cat > .env <<'EOF'
APP_IMAGE=ghcr.io/dartrix137/web-anchetasco
EOF
chmod 600 .env
```

(Es el contenido de `deploy/.env.example`. La app no necesita más variables.)

### Acceso a la imagen en GHCR

La primera vez que el workflow sube la imagen, GitHub crea el paquete `web-anchetasco`, normalmente **privado**. Tienes dos opciones:

**Opción A — dejarlo privado (recomendado si el repo es privado):** inicia sesión en GHCR desde el servidor con un token de **solo lectura**.

1. En GitHub: **foto de perfil → Settings → Developer settings → Personal access tokens → Tokens (classic) → Generate new token (classic)**.
2. Nombre: `vps-anchetasco-ghcr`, expiración a tu gusto, scope **solo `read:packages`**.
3. En el servidor:

   ```bash
   docker login ghcr.io -u Dartrix137
   # Password: pega el token (no se ve al escribir)
   ```

   Las credenciales quedan en `/home/deploy/.docker/config.json`. Si el token caduca, repite el `docker login` con uno nuevo.

**Opción B — hacer el paquete público:** en GitHub, **perfil → Packages → web-anchetasco → Package settings → Change visibility → Public**. Así no hace falta `docker login`. La imagen solo contiene el código compilado de la web y sus imágenes, sin secretos.

## 4. Primer despliegue

1. Haz commit y push de los archivos de despliegue a `main`. El workflow arranca solo.
   También puedes lanzarlo a mano: **Actions → Build y despliegue → Run workflow**.
2. Sigue el progreso en la pestaña **Actions**. El primer build tarda unos minutos; los siguientes usan caché.
3. Si elegiste la opción A, el paquete se crea durante el primer build: haz el `docker login` del paso 3 antes de que llegue el job de despliegue, o simplemente vuelve a lanzar el workflow cuando termine.

Comprobar que funciona:

```bash
# En el servidor
cd /home/deploy/app
docker compose ps          # app debe aparecer "healthy" y caddy "running"
curl -I http://localhost   # debe responder HTTP/1.1 200
```

Y desde tu navegador: **http://50.6.206.188**

## 5. Operación diaria

Todos los comandos se ejecutan en el servidor, dentro de `/home/deploy/app`.

| Tarea | Comando |
|---|---|
| Estado de los contenedores | `docker compose ps` |
| Logs de la app (en vivo) | `docker compose logs -f app` |
| Logs de Caddy | `docker compose logs -f caddy` |
| Últimas 100 líneas | `docker compose logs --tail 100 app` |
| Reiniciar la app | `docker compose restart app` |
| Reiniciar todo | `docker compose restart` |
| Recargar Caddy tras cambiar el Caddyfile | `docker compose exec caddy caddy reload --config /etc/caddy/Caddyfile` |
| Consumo de RAM/CPU | `docker stats --no-stream` |
| Espacio en disco de Docker | `docker system df` |

Docker ya limita los logs a 10 MB × 3 archivos por contenedor (configuración del servidor).

Para desplegar, solo haz push a `main`. Los cambios en `deploy/docker-compose.yml` y `deploy/Caddyfile` también se despliegan solos. **No edites esos archivos en el servidor**: el siguiente despliegue los sobrescribe. El `.env` del servidor no se toca nunca.

### Volver a una versión anterior

Cada imagen queda en GHCR con el SHA corto de su commit (7 caracteres, el mismo que muestra GitHub en la lista de commits, p. ej. `a1b2c3d`). Para volver a una:

```bash
cd /home/deploy/app
APP_TAG=a1b2c3d docker compose pull app
APP_TAG=a1b2c3d docker compose up -d app
```

Esto es temporal: el siguiente push a `main` vuelve a desplegar `latest`. Para que el rollback sea definitivo, revierte el commit en el repo (`git revert <sha>` + push).

Para volver a la última versión sin hacer push: `docker compose pull app && docker compose up -d app`.

Las imágenes de rollback quedan etiquetadas en el servidor y `docker image prune -f` no las borra. Para limpiarlas: `docker image prune -a -f` (borra todas las imágenes que no estén en uso; se pueden volver a descargar de GHCR).

## 6. Dominio anchetasco.com y HTTPS

El dominio `anchetasco.com` (comprado en Bluehost, con los nameservers de Bluehost) ya está configurado en `deploy/Caddyfile`:

- `https://anchetasco.com` → la web, con certificado de Let's Encrypt que Caddy obtiene y renueva solo.
- `www.anchetasco.com` → redirige a `https://anchetasco.com`.
- `http://50.6.206.188` (acceso por IP) → redirige a `https://anchetasco.com`.

### DNS en Bluehost

En **Bluehost → Domains → anchetasco.com → DNS** (Zone Editor) deben existir:

| Tipo | Host / Nombre | Apunta a | TTL |
|---|---|---|---|
| A | `@` | `50.6.206.188` | el mínimo disponible (p. ej. 1 hora o menos) |
| A | `www` | `50.6.206.188` | igual |

- Si ya hay un registro A para `@` o `www` apuntando a otra IP (hosting compartido o "parking" de Bluehost), **edítalo**; no dejes dos registros A con IPs distintas.
- Si `www` existe como **CNAME** a `anchetasco.com`, también sirve; puedes dejarlo.
- **No crees registros AAAA** (IPv6) salvo que el VPS tenga IPv6 configurado: Let's Encrypt los prefiere y la validación fallaría.
- No toques los registros MX/TXT si usas correo con el dominio.

Comprueba la propagación desde tu PC: `nslookup anchetasco.com 8.8.8.8` debe devolver `50.6.206.188`.

### Si el certificado no se emite

`docker compose logs caddy | grep -i -E "error|certificate|acme"`. Causas típicas: el DNS aún no apunta al VPS, hay un AAAA que apunta a otro lado, o los puertos 80/443 están cerrados (ufw ya los permite). Caddy reintenta solo; cuando el DNS esté bien, emite el certificado sin hacer nada más.

### Cambiar de dominio o añadir otro

Edita los bloques del dominio en `deploy/Caddyfile`, haz commit y push. El workflow copia el archivo y recarga Caddy.

> Los certificados se guardan en el volumen `anchetasco_caddy_data`. No lo borres (`docker compose down -v` lo borraría): Let's Encrypt limita cuántos certificados se pueden emitir por semana.

## 7. Backups

**No hay base de datos que respaldar**: la app no guarda datos y todo el código e imágenes están en GitHub.

En el servidor solo hay dos cosas que conviene guardar:

- `/home/deploy/app/.env` (una línea, fácil de recrear).
- Los certificados de Caddy (opcional; si se pierden, Caddy los vuelve a pedir):

  ```bash
  docker run --rm -v anchetasco_caddy_data:/data -v "$PWD":/backup alpine \
    tar czf /backup/caddy_data-$(date +%F).tar.gz -C /data .
  ```

## Solución de problemas

| Síntoma | Qué revisar |
|---|---|
| El job "Desplegar" falla en SSH | Secrets `SSH_*` correctos; la llave pública está en `~/.ssh/authorized_keys` de `deploy`; fail2ban no bloqueó la IP (`sudo fail2ban-client status sshd`). |
| `denied` / `unauthorized` al hacer pull | Paquete privado sin `docker login ghcr.io` en el servidor, o token caducado (paso 3). |
| `app` queda `unhealthy` | `docker compose logs app`. El healthcheck llama a `http://127.0.0.1:3000/api`. |
| 502 Bad Gateway | La app está arrancando o caída: `docker compose ps` y logs de `app`. |
| Cambié el Caddyfile y no se aplica | `docker compose restart caddy`. |
