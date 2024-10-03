import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

let client: ApolloClient<any> | null = null;

const getClient = () => {
  if (!client) {
    client = new ApolloClient({
      ssrMode: true,
      link: new HttpLink({
        uri: "http://localhost:3000/api/graphql",
        fetch,
      }),
      cache: new InMemoryCache(),
    });
  }
  return client;
};

export default getClient();
