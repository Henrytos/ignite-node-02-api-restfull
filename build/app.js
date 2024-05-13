"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// src/app.ts
var app_exports = {};
__export(app_exports, {
  app: () => app
});
module.exports = __toCommonJS(app_exports);
var import_fastify = __toESM(require("fastify"));

// src/routes/transactions.ts
var import_zod2 = require("zod");

// src/database.ts
var import_config = require("dotenv/config");
var import_knex = require("knex");

// src/env/index.ts
var import_dotenv = require("dotenv");
var import_zod = require("zod");
if (process.env.NODE_ENV === "test") {
  (0, import_dotenv.config)({ path: ".env.test" });
} else {
  (0, import_dotenv.config)();
}
var envSchema = import_zod.z.object({
  NODE_ENV: import_zod.z.enum(["development", "test", "production"]).default("production"),
  DATABASE_URL: import_zod.z.string(),
  PORT: import_zod.z.coerce.number().default(3333)
});
var _env = envSchema.safeParse(process.env);
if (_env.success === false) {
  console.error("\u26A0\uFE0F Invalid environment variables", _env.error.format());
  throw new Error("Invalid environment variables.");
}
var env = _env.data;
console.log(env.DATABASE_URL);

// src/database.ts
console.log(env.DATABASE_URL);
var config2 = {
  client: "sqlite3",
  connection: {
    filename: env.DATABASE_URL
  },
  migrations: {
    extension: "ts",
    directory: "./db/migrations"
  },
  useNullAsDefault: true
};
var knex = (0, import_knex.knex)(config2);

// src/middlewares/check-session-id-exist.ts
function checkSessionIdExists(request, reply) {
  return __async(this, null, function* () {
    const sessionId = request.cookies.sessionId;
    if (!sessionId) {
      return reply.status(401).send({
        error: "Unauthorized."
      });
    }
  });
}

// src/routes/transactions.ts
function transactionsRoutes(app2) {
  return __async(this, null, function* () {
    app2.get(
      "/",
      {
        preHandler: [checkSessionIdExists]
      },
      (request, reply) => __async(this, null, function* () {
        const { sessionId } = request.cookies;
        const transactions = yield knex("transactions").where("session_id", sessionId).select();
        return reply.status(200).send({ transactions });
      })
    );
    app2.get(
      "/summary",
      {
        preHandler: [checkSessionIdExists]
      },
      (request) => __async(this, null, function* () {
        const { sessionId } = request.cookies;
        const summary = yield knex("transactions").where("session_id", sessionId).sum("amount", { as: "amount" }).first();
        return { summary };
      })
    );
    app2.get(
      "/:id",
      {
        preHandler: [checkSessionIdExists]
      },
      (request) => __async(this, null, function* () {
        const getTransactionRequestSchema = import_zod2.z.object({
          id: import_zod2.z.string().uuid()
        });
        const { sessionId } = request.cookies;
        const { id } = getTransactionRequestSchema.parse(request.params);
        const transaction = yield knex("transactions").where({
          id,
          session_id: sessionId
        }).first();
        return { transaction };
      })
    );
    app2.post("/", (request, reply) => __async(this, null, function* () {
      const createTransactionBodySchema = import_zod2.z.object({
        title: import_zod2.z.string(),
        amount: import_zod2.z.number(),
        type: import_zod2.z.enum(["credit", "debit"])
      });
      const { title, amount, type } = createTransactionBodySchema.parse(
        request.body
      );
      let { sessionId } = request.cookies;
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        reply.setCookie("sessionId", sessionId, {
          path: "/",
          maxAge: 60 * 60 * 24 * 7
          // 7 days
        });
      }
      yield knex("transactions").insert({
        title,
        amount: type === "debit" ? -amount : amount,
        session_id: sessionId
      });
      return reply.status(201).send();
    }));
  });
}

// src/app.ts
var import_cookie = __toESM(require("@fastify/cookie"));

// src/middlewares/show-request.ts
function showRequest(request) {
  return __async(this, null, function* () {
    console.log(`[${request.method}] ${request.url}`);
  });
}

// src/app.ts
var app = (0, import_fastify.default)();
app.register(import_cookie.default);
app.addHook("preHandler", showRequest);
app.register(transactionsRoutes, {
  prefix: "transactions"
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  app
});
