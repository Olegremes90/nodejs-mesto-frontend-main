require('dotenv').config({ path: '.env.front' });

const {
    DEPLOY_USER, DEPLOY_HOST, DEPLOY_PATH, DEPLOY_REF = 'origin/master',
} = process.env;

module.exports = {
    apps: [{
        name: 'frontend',
        script: 'serve',  // Используем serve для раздачи статических файлов
        args: '-s build -l 3000',  // Укажите порт, который вам нужен
        cwd: DEPLOY_PATH,  // Указываем директорию, где будет папка build
        env: {
            NODE_ENV: 'production'
        }
    }],

    // Настройка деплоя
    deploy: {
        production: {
            user: DEPLOY_USER,
            host: DEPLOY_HOST,
            ref: DEPLOY_REF,
            repo: 'https://github.com/Olegremes90/nodejs-mesto-frontend-main.git',
            path: DEPLOY_PATH,
            'pre-deploy-local': `scp .env.front ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}`,
            'post-deploy': 'export NODE_OPTIONS=--openssl-legacy-provider && source ~/.nvm/nvm.sh && npm install && npm run build && pm2 startOrReload ecosystem.config.js --only frontend',  // Используем startOrReload
        },
    },
};
