require('dotenv').config({ path: '.env.front' });

const {
    DEPLOY_USER,
    DEPLOY_HOST,
    DEPLOY_PATH,
    DEPLOY_REF = 'origin/master',
} = process.env;

module.exports = {
    apps: [
        {
            name: 'frontend',
            script: 'npx',
            args: ['serve', '-s', 'build', '-l', '3001'], // раздача статических файлов из build на порту 3000
            cwd: DEPLOY_PATH,                    // директория проекта на сервере (где есть папка build)
            env: {
                NODE_ENV: 'production',
                PORT: 3001,
            },
            watch: false
        }
    ],

    deploy: {
        production: {
            user: DEPLOY_USER,
            host: DEPLOY_HOST,
            ref: DEPLOY_REF,
            repo: 'https://github.com/Olegremes90/nodejs-mesto-frontend-main.git',
            path: DEPLOY_PATH,
            'pre-deploy-local': `scp .env.front ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/source/.env.front`,
            'post-deploy': 'export NODE_OPTIONS=--openssl-legacy-provider && source ~/.nvm/nvm.sh && npm install && npm run build && pm2 startOrReload ecosystem.config.js --only frontend',
            ssh_options: 'StrictHostKeyChecking=no',
        },
    },
};

