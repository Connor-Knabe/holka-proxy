var CronJob = require('cron').CronJob;
var certbotProc;
var spawn = require('child_process').spawn;
module.exports = function () {
    var certbotRenew = new CronJob(
        '00 45 7 * * 0',
        () => {
            console.log(new Date(), 'running cert renew');
            if (certbotProc) certbotProc.kill();

            certbotProc = spawn('certbot', ['renew']);

            certbotProc.stdout.on('data', data => {
                console.log(`Certbot info: ${data}`);
            });

            certbotProc.stderr.on('data', data => {
                console.error(`Certbot error: ${data}`);
            });

            certbotProc.on('close', code => {
                console.log(`Certbot process exited with code ${code}`);
            });
        },
        () => {
            /* This function is executed when the job stops */
        },
        true /* Start the job right now */,
        'America/Chicago'
    );
};