import { WellfoundClient } from "../client";
const wellfound= new WellfoundClient()
import dotenv from 'dotenv' 
dotenv.config()

export async function getJobSearchPage() {
  const userId = process.env.WELLFOUND_USER_ID;

  if (!userId) {
    throw new Error("WELLFOUND_USER_ID is missing");
  }

  return wellfound.wellFoundRequest({
    operationName: "JobSearchPage",

    variables: {
      location: "temp until we fetch from location",
      userId,
    },

    operationId:
      "tfe/4832374e4950b2762c913ea6af33741781f80929c12faaebdfbd423f02b918a2",
  });
}
