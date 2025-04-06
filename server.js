/*port express from "express"
import cors from "cors"
import axios from "axios"

const app = express();

app.use(cors());

const Pexels_Api_Key = "ds2iHrXBRXnY5saZnNzvkacGGa5CXQNSdGgm4FJOpq6cjoyaNYiQgxgB";
console.log("Pexel api key", Pexels_Api_Key);

app.get("/api/recipes", async (req, res) => {
	try {
		const response = await axios.get("https://api.pexels.com/v1/search", {
			params: {
				query: "Pasta",
				per_page:10
			},
			headers: {
				Authorization: `Bearer ${Pexels_Api_Key}`,
			}
		});
		res.json(response.data);
	} catch (error) {
		console.error("Api Error", error.message);
		res.json({
			error: error.message
		});
	}
});

app.listen(5000, () => {
	console.log("Server running on port 5000");
}
);*/