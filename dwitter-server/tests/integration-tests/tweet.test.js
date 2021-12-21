// //테스트 전! 서버 시작 및 데이터베이스 초기화! 설정!
// //테스트 후! 데이터베이스 깨끗하게 청소!

// import axios from "axios";
// import { startServer, stopServer } from "../../app.js";
// import faker from "faker";
// import { createNewUserAccount } from "./auth_utils.js";

// describe("Tweets APIs", () => {
//   let server;
//   let request;
//   beforeAll(async () => {
//     server = await startServer();
//     request = axios.create({
//       baseURL: `http://localhost:${server.address().port}`,
//       validateStatus: null,
//       //axios는 200:성공, 그 이외의 300,400은 에러를 던짐
//       //따라서 catch로 따로 처리를해줘야하지만 테스트는 우리가 예상하는 것이기 때문에
//       //null로 모두 성공으로 가정함
//     });
//   });

//   afterAll(async () => {
//     await stopServer(server); //server를 닫음
//   });

//   describe("POST /tweets", () => {
//     it("returns 201 when create tweet normally", async () => {
//       //given
//       const text = faker.random.words(3);
//       const user = await createNewUserAccount(request);
//       //action
//       const res = await request.post(
//         "/tweets",
//         { text: text },
//         { headers: { Authorization: `Bearer ${user.jwt}` } }
//       );
//       //then
//       expect(res.status).toBe(201);
//     });
//   });
// });
