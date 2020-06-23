import { SocketIoConfig } from "ngx-socket-io";
import { environment } from "src/environments/environment";

export const appSocketConfig: SocketIoConfig = {
  url: environment.serverAddress,
  options: {},
};
