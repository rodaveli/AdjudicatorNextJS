-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "user1_id" TEXT,
    "user2_id" TEXT,
    "user1_name" TEXT,
    "user2_name" TEXT,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Argument" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "image_url" TEXT,
    "session_id" INTEGER NOT NULL,

    CONSTRAINT "Argument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Judgement" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "winner" TEXT NOT NULL,
    "winning_argument" TEXT NOT NULL,
    "winning_user_id" TEXT NOT NULL,
    "loser" TEXT NOT NULL,
    "losing_argument" TEXT NOT NULL,
    "losing_user_id" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "session_id" INTEGER NOT NULL,

    CONSTRAINT "Judgement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Appeal" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "session_id" INTEGER NOT NULL,

    CONSTRAINT "Appeal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppealJudgement" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "winner" TEXT NOT NULL,
    "winning_argument" TEXT NOT NULL,
    "loser" TEXT NOT NULL,
    "losing_argument" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "session_id" INTEGER NOT NULL,

    CONSTRAINT "AppealJudgement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Judgement_session_id_key" ON "Judgement"("session_id");

-- CreateIndex
CREATE UNIQUE INDEX "AppealJudgement_session_id_key" ON "AppealJudgement"("session_id");

-- AddForeignKey
ALTER TABLE "Argument" ADD CONSTRAINT "Argument_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Judgement" ADD CONSTRAINT "Judgement_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Appeal" ADD CONSTRAINT "Appeal_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppealJudgement" ADD CONSTRAINT "AppealJudgement_session_id_fkey" FOREIGN KEY ("session_id") REFERENCES "Session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
