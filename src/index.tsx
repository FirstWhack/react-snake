import * as React from "react";
import { render } from "react-dom";

import Snake from "./game/Snake";

const rootElement = document.getElementById("root");
render(<Snake />, rootElement);
