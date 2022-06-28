import sanityClient from "@sanity/client"
import dotenv from "dotenv";
dotenv.config();

export default sanityClient({
  projectId:"30u6aoq4",
  dataset:"production",
  useCdn:false,
  apiVersion:"2022-06-19",
  token:process.env.SANITY_API_TOKEN,
});