import { ApolloServer } from "@apollo/server";
import { startServerAndCreateNextHandler } from "@as-integrations/next";
import { typeDefs } from "./schema";
import { resolvers } from "./resolver";
import { getCurrentUser } from "@/app/actions/auth";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async () => {
    const currentUser = await getCurrentUser();
    return { currentUser };
  },
});

export { handler as GET, handler as POST };
