import {
    IHttp,
    IModify,
    IRead,
} from "@rocket.chat/apps-engine/definition/accessors";
import { IRoom } from "@rocket.chat/apps-engine/definition/rooms";
import { IUser } from "@rocket.chat/apps-engine/definition/users";
const email = {
    to: "deepmoyrs@gmail.com",
    subject: "Testing MailAPI",
    body: "Hi if this works mailBridge is sorted",
};

async function createBody(to: string, subject: string, body: string) {
    const rawMessage = Buffer.from(
        `To: ${to}\r\n` +
            `Subject: ${subject}\r\n` +
            `Content-Type: text/plain; charset="UTF-8"\r\n` +
            `Content-Transfer-Encoding: 7bit\r\n\r\n` +
            `${body}`
    )
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");

    return { raw: rawMessage };
}

export async function sendMail(
    room: IRoom,
    user: IUser,
    read: IRead,
    modify: IModify,
    http: IHttp,
    accessToken: string
) {
    const body = await createBody(email.to, email.subject, email.body);
    const userId = "me";
    const apiEndpoint = `https://gmail.googleapis.com/gmail/v1/users/${userId}/messages/send`;
    const response = await http.post(apiEndpoint, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        data: body,
    });

    if (response.statusCode !== 200) {
        return { error: response.statusCode };
    }

    return response.data;
}
