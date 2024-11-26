import express from "express";
import playersRoutes from "./player.js";
import teamsRoutes from "./teams.js";
import managersRoutes from "./manager.js";
import matchesRoutes from "./matches.js";
import leaguesRoutes from "./leagues.js";
import fantasyRoutes from "./fantasy.js";
import userRoutes from "./user.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

// Use route files for each entity
app.use("/player", playersRoutes); // Player routes
app.use("/team", teamsRoutes); // Team routes
app.use("/manager", managersRoutes); // Manager routes
app.use("/matches", matchesRoutes);
app.use("/leagues", leaguesRoutes);
app.use("/fantasy", fantasyRoutes);
app.use("/user", userRoutes);
app.listen(8800, () => {
  console.log("Connected to backend!");
});
