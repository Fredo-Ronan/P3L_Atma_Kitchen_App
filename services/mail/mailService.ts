import nodemailer from 'nodemailer';
import { MailInterface } from './maiLInterface';

// At the top of your file, declare a custom process.env interface
declare global {
    namespace NodeJS {
        interface ProcessEnv {
            MAIL_HOST: string;
            MAIL_PORT: string;
            MAIL_TLS: string;
            MAIL_USERNAME: string;
            MAIL_PASSWORD: string;
            MAIL_SENDER: string;
            // Add other environment variables if needed
        }
    }
}

export default class MailService {
    private static instance: MailService;
    private transporter!: nodemailer.Transporter;

    private constructor() {}
    //INSTANCE CREATE FOR MAIL
    static getInstance() {
        if (!MailService.instance) {
            MailService.instance = new MailService();
        }
        return MailService.instance;
    }
    //CREATE CONNECTION FOR LOCAL
    async createLocalConnection() {
        let account = await nodemailer.createTestAccount();
        this.transporter = nodemailer.createTransport({
            host: account.smtp.host,
            port: account.smtp.port,
            secure: account.smtp.secure,
            auth: {
                user: account.user,
                pass: account.pass,
            },
        });
    }
    //CREATE A CONNECTION FOR LIVE
    async createConnection() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: parseInt(process.env.MAIL_PORT),
            secure: false,
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });
    }
    //SEND MAIL
    async sendMail(
        requestId: string | number | string[],
        options: MailInterface
    ) {
        if (!this.transporter) {
            throw new Error('Transporter is not initialized');
        }

        return await this.transporter
            .sendMail({ 
                from: `Atma Kitchen Support <${process.env.MAIL_SENDER}>`,
                to: options.to,
                cc: options.cc,
                bcc: options.bcc,
                subject: options.subject,
                text: options.text,
                html: options.html,
            })
            .then((info: any) => {
                console.log(`${requestId} - Mail sent successfully!!`);
                console.log(`${requestId} - [MailResponse]=${info.response} [MessageID]=${info.messageId}`);
                return info;
            });
    }
    //VERIFY CONNECTION
    async verifyConnection() {
        if (!this.transporter) {
            throw new Error('Transporter is not initialized');
        }

        return this.transporter.verify();
    }
    //CREATE TRANSPORTER
    getTransporter() {
        return this.transporter;
    }
}