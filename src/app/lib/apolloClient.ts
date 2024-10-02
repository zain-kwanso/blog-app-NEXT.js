import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

export const createApolloClient = () => {
  return new ApolloClient({
    ssrMode: true,
    link: new HttpLink({
      uri: "http://localhost:3000/api/graphql",
      fetch,
    }),
    cache: new InMemoryCache(),
  });
};
