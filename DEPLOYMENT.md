# Deployment Guide for Quiz Master

## Local Development
```bash
npm run dev
```
The app runs on `http://localhost:3000` with auto-connecting socket.io.

## Production Deployment on Subdomain

### Prerequisites
- Node.js 18+ 
- Your subdomain configured and pointing to your server

### Setup Steps

#### 1. Update Environment Variables
Create a `.env.local` file in the project root:

```bash
# .env.local
ALLOWED_ORIGIN=https://quiz.yourdomain.com
NODE_ENV=production
```

#### 2. Build the Project
```bash
npm run build
```

#### 3. Start the Server
```bash
npm start
```

The app will run on port 3000 by default.

#### 4. Configure Reverse Proxy (Nginx Example)

```nginx
server {
    listen 80;
    server_name quiz.yourdomain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name quiz.yourdomain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket configuration
    location /socket.io {
        proxy_pass http://localhost:3000/socket.io;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "Upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

#### 5. Configure with PM2 (Recommended for Production)

Install PM2:
```bash
npm install -g pm2
```

Create `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'quiz-master',
    script: './node_modules/.bin/tsx',
    args: 'server.ts',
    env: {
      NODE_ENV: 'production',
      ALLOWED_ORIGIN: 'https://quiz.yourdomain.com'
    },
    instances: 1,
    exec_mode: 'cluster',
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
  }]
};
```

Start with PM2:
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

## Key Changes for Subdomain Hosting

### Socket.io Connection
- **Before**: `http://localhost:3000` (hardcoded)
- **After**: Automatically uses `window.location.origin`
- Works on any subdomain automatically

### CORS Configuration
- **Development**: Allows all origins for testing
- **Production**: Restricts to `ALLOWED_ORIGIN` environment variable
- Credentials enabled for production

### HTTPS/WSS Support
- Socket.io automatically upgrades to WebSocket Secure (WSS) when using HTTPS
- Nginx reverse proxy handles SSL/TLS termination

## Troubleshooting

### Socket connection fails
- Check that `ALLOWED_ORIGIN` matches your actual subdomain
- Verify Nginx proxy headers are configured correctly
- Check browser console for WebSocket errors

### CORS errors
- Ensure `ALLOWED_ORIGIN` includes the protocol (http:// or https://)
- Make sure it matches exactly (e.g., no trailing slash)

### WebSocket connection blocked
- This usually means CORS is misconfigured
- Check that your Nginx has proper WebSocket headers
- Verify your SSL certificate is valid

## Security Recommendations

1. **Use HTTPS in production** - Required for WebSocket Secure (WSS)
2. **Set specific ALLOWED_ORIGIN** - Don't use wildcard in production
3. **Use environment variables** - Never hardcode sensitive config
4. **Restrict admin access** - Consider adding authentication to admin panel
5. **Set up firewall rules** - Only allow necessary ports (80, 443)

## Performance Tips

1. **Use PM2 clustering** - Enable multiple app instances
2. **Enable Nginx caching** - For static assets
3. **Configure session persistence** - Use Redis for quiz state (future enhancement)
4. **Monitor memory usage** - Quiz sessions stored in memory currently

## Future Enhancements

- Add database storage for quiz history
- Implement user authentication
- Add admin authentication
- Session persistence across server restarts
- Multi-server support with Redis pub/sub
