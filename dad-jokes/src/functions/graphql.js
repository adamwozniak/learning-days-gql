const { app } = require('@azure/functions');
const { ApolloServer } = require('@apollo/server');
const { v4 } = require('@as-integrations/azure-functions');

const jokes = [
    {
        id: '1',
        joke: 'Why did the chicken cross the road? To get to the other side!',
        author: {
            id: '1',
            name: 'Anonymous',
        },
    },
    {
        id: '2',
        joke: 'Why did the chicken cross the playground? To get to the other slide!',
        author: {
            id: '1',
            name: 'Anonymous',
        },
    },
    {
        id: '3',
        joke: 'Why did the chicken cross the road? To prove he wasn’t chicken!',
        author: {
            id: '2',
            name: 'Adam W',
        }
    }
]

// The GraphQL schema
const typeDefs = `#graphql
  type Query {
    jokes(authorId: ID): [Joke]!
    authors(authorId: ID): [Author]!
  }
  type Mutation {
    addJoke(input: AddJokeInput!): Joke!
  }
  type Joke {
    id: ID!
    joke: String!
    author: Author!
  }
  type Author {
    id: ID!
    name: String!
  }
  input AddJokeInput {
    joke: String!
    authorId: ID!
  }
`;

// A map of functions which return data for the schema.
const resolvers = {
    Query: {
        jokes: (parent, args, contextValue, info) => {
            if (args.authorId) {
                return jokes.filter(joke => joke.author.id === args.authorId);
            }
            return jokes;
        },
        authors: (parent, args, contextValue, info) => {
            if (args.authorId) {
                return jokes.filter(joke => joke.author.id === args.authorId).map(joke => joke.author);
            }
            return jokes.map(joke => joke.author)
        }
    },
    Mutation: {
        addJoke: (parent, args, contextValue, info) => {
            const input = args.input;
            const newJoke = {
                id: (jokes.length + 1).toString(),
                joke: input.joke,
                author: jokes.find(joke => joke.author.id === input.authorId).author,
            }
            console.log(newJoke);
            jokes.push(newJoke);
            return newJoke;
        }
    }
};

// Set up Apollo Server
const server = new ApolloServer({
    typeDefs,
    resolvers,
});

app.http('graphql', {
    handler: v4.startServerAndCreateHandler(server),
});
