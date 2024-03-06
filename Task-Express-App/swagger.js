import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";

const swaggerDocument = YAML.load("./swagger.yaml");

export const swaggerServe = swaggerUi.serve;

export const swaggerSetup = swaggerUi.setup(swaggerDocument);
