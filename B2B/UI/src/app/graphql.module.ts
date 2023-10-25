import { environment } from 'environments/environment'; 
import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {ApolloClientOptions, InMemoryCache, ApolloLink, createHttpLink} from '@apollo/client/core';
import {HttpLink} from 'apollo-angular/http';


const uri = `${environment.apiUrl}`+'graphql'; // -- add the URL of the GraphQL server here

export function createApollo(httpLink: HttpLink): ApolloClientOptions<any> {
  const link = ApolloLink.from([httpLink.create({ uri })]);
  // const link = authLink.concat(httpLink2);
  const cache = new InMemoryCache();
 
  return {
    link,
    cache
  };
}

@NgModule({
  exports: [ApolloModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink],
    },
  ],
})
export class GraphQLModule {}
