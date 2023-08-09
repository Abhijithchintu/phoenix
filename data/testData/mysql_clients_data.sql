USE `phoenixOauth`;
INSERT INTO clients (client_id, status, client_name, description,`key`) VALUES
	 (1, 1,'people','people node app service','people-key');
INSERT INTO clients (client_id, status, client_name, description,`key`) VALUES
	 (2, 1,'chat','chat node app service','chat-key');


USE `phoenixPeople`;
INSERT INTO clients (client_id, status, client_name, description,`key`) VALUES
	 (1, 1,'oauth','oauth node app service','oauth-key');
INSERT INTO clients (client_id, status, client_name, description,`key`) VALUES
	 (2, 1,'chat','chat node app service','chat-key');

INSERT INTO client_permissions
(client_id, status, api)
VALUES(2, 1, '/getRelationBetween');


USE `phoenixChat`;
INSERT INTO clients (client_id, status, client_name, description,`key`) VALUES
	 (1, 1,'people','people node app service','people-key');
INSERT INTO clients (client_id, status, client_name, description,`key`) VALUES
	 (2, 1,'oauth','oauth node app service','oauth-key');

