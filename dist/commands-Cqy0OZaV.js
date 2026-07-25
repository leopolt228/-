import { t as closedObject } from "./closed-object-DY9fiMP-.js";
import { a as NonEmptyString } from "./primitives-DLJWVBVf.js";
import { Type } from "typebox";
/** Maximum command description length accepted in catalog entries. */
const COMMAND_DESCRIPTION_MAX_LENGTH = 2e3;
const BoundedNonEmptyString = (maxLength) => Type.String({
	minLength: 1,
	maxLength
});
/** Source system that contributed a command. */
const CommandSourceSchema = Type.Union([
	Type.Literal("native"),
	Type.Literal("skill"),
	Type.Literal("plugin")
]);
/** Surfaces where a command may be invoked. */
const CommandScopeSchema = Type.Union([
	Type.Literal("text"),
	Type.Literal("native"),
	Type.Literal("both")
]);
/** Coarse UI grouping for command catalog display. */
const CommandCategorySchema = Type.Union([
	Type.Literal("session"),
	Type.Literal("options"),
	Type.Literal("status"),
	Type.Literal("management"),
	Type.Literal("media"),
	Type.Literal("tools"),
	Type.Literal("docks")
]);
/** Static argument choice shown to clients. */
const CommandArgChoiceSchema = closedObject({
	value: Type.String({ maxLength: 200 }),
	label: Type.String({ maxLength: 200 })
});
/** One typed argument advertised for a command. */
const CommandArgSchema = closedObject({
	name: BoundedNonEmptyString(200),
	description: Type.String({ maxLength: 500 }),
	type: Type.Union([
		Type.Literal("string"),
		Type.Literal("number"),
		Type.Literal("boolean")
	]),
	required: Type.Optional(Type.Boolean()),
	choices: Type.Optional(Type.Array(CommandArgChoiceSchema, { maxItems: 50 })),
	dynamic: Type.Optional(Type.Boolean())
});
/** One command catalog entry visible to clients. */
const CommandEntrySchema = closedObject({
	name: BoundedNonEmptyString(200),
	nativeName: Type.Optional(BoundedNonEmptyString(200)),
	textAliases: Type.Optional(Type.Array(BoundedNonEmptyString(200), { maxItems: 20 })),
	description: Type.String({ maxLength: COMMAND_DESCRIPTION_MAX_LENGTH }),
	category: Type.Optional(CommandCategorySchema),
	source: CommandSourceSchema,
	scope: CommandScopeSchema,
	acceptsArgs: Type.Boolean(),
	args: Type.Optional(Type.Array(CommandArgSchema, { maxItems: 20 }))
});
/** Command catalog request filters. */
const CommandsListParamsSchema = closedObject({
	agentId: Type.Optional(NonEmptyString),
	provider: Type.Optional(NonEmptyString),
	scope: Type.Optional(CommandScopeSchema),
	includeArgs: Type.Optional(Type.Boolean())
});
/** Bounded command catalog response. */
const CommandsListResultSchema = closedObject({ commands: Type.Array(CommandEntrySchema, { maxItems: 500 }) });
//#endregion
export { CommandsListParamsSchema as n, CommandsListResultSchema as r, COMMAND_DESCRIPTION_MAX_LENGTH as t };
