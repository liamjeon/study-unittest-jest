import express from "express";
import "express-async-errors";
import { body } from "express-validator";
import { isAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validator.js";

const router = express.Router();

const validateTweet = [
  body("text")
    .trim()
    .isLength({ min: 3 })
    .withMessage("text should be at least 3 characters"),
  validate,
];

//내부적으로 자체적으로 tweetContoller에 대해 의존하는 것이 아니라
//외부로부터 주어진 Controller를 이용할거야.
//주의, getTweets을 호출하면 getTweet안에서 this 값을 잃어버림
//이때 function이 아닌 Arrow Function을 사용해야함. 이유는 자동으로 this가 바인딩됨
export default function tweetsRouter(tweetController) {
  // GET /tweet
  // GET /tweets?username=:username
  router.get("/", isAuth, tweetController.getTweets);

  // GET /tweets/:id
  router.get("/:id", isAuth, tweetController.getTweet);

  // POST /tweeets
  router.post("/", isAuth, validateTweet, tweetController.createTweet);

  // PUT /tweets/:id
  router.put("/:id", isAuth, validateTweet, tweetController.updateTweet);

  // DELETE /tweets/:id
  router.delete("/:id", isAuth, tweetController.deleteTweet);

  return router;
}
