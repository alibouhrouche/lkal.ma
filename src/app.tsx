import { Route, Router, Switch } from "wouter";
import Boards from "./spa/boards";
import Board from "./spa/board";
import Providers from "./Providers";
import "@/syntax.css";

export default function App({ ssrPath }: { ssrPath: string }) {
    return (
        <Router ssrPath={ssrPath}>
            <Providers>
                <Switch>
                    <Route path="/boards" component={Boards} />
                    <Route path="/b/:id" component={Board} />
                </Switch>
            </Providers>
        </Router>
    )
}