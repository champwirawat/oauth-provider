export interface AuthQueryAuthorizationDto {
  response_type: string;
  redirect_uri: string;
  client_id: string;
  scope?: string;
}
