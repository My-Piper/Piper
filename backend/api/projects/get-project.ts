import { toPlain } from "core-kit/utils/models";
import { Primitive } from "types/primitive";
import { api } from "../../app/api";
import mongo from "../../app/mongo";
import { HIDDEN_STRING } from "../../consts/core";
import { Project } from "../../models/project";
import { checkLogged, handle, toModel } from "../../utils/http";

api.get(
  "/api/projects/:_id",
  handle(({ currentUser }) => async ({ params: { _id } }) => {
    checkLogged(currentUser);

    const project = toModel(await mongo.projects.findOne({ _id }), Project);

    const { environment } = project;
    if (!!environment) {
      const { variables } = environment;
      for (const [k, v] of variables || new Map<string, Primitive>()) {
        switch (typeof v) {
          case "string":
            variables.set(k, HIDDEN_STRING);
            break;
        }
      }
    }

    return toPlain(project);
  })
);
