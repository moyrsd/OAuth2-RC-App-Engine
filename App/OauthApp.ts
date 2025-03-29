import { IConfigurationExtend } from "@rocket.chat/apps-engine/definition/accessors";
// New files to be created in the project root folder
import { OAuth2Service } from "./OAuth2Service";
import { OAuthCommand } from "./commands/OauthCommand";
import { App } from "@rocket.chat/apps-engine/definition/App";

export class OAuthApp extends App {
    private oauth2Service: OAuth2Service;

    protected async extendConfiguration(
        configuration: IConfigurationExtend
    ): Promise<void> {
        const oauthConfig = {
            alias: "test",
            accessTokenUri: "https://oauth2.googleapis.com/token",
            authUri: "https://accounts.google.com/o/oauth2/v2/auth",
            refreshTokenUri: "https://oauth2.googleapis.com/token",
            revokeTokenUri: "https://oauth2.googleapis.com/revoke",
            defaultScopes: [
                "profile",
                "email",
                "https://www.googleapis.com/auth/gmail.readonly",
                "https://www.googleapis.com/auth/gmail.send",
                "https://www.googleapis.com/auth/gmail.compose",
            ],
        };

        this.oauth2Service = new OAuth2Service(this, oauthConfig);
        await this.oauth2Service.setup(configuration);

        // Register the slash command and pass the logger
        configuration.slashCommands.provideSlashCommand(
            new OAuthCommand(this.oauth2Service, this.getLogger())
        );
        
    }
}
