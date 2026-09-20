import { db } from './index.ts';
import { users, studySessions, tasks, quizRecords } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

export async function getOrCreateUser(
  uid: string, 
  email: string, 
  displayName?: string, 
  photoUrl?: string
) {
  try {
    const result = await db.insert(users)
      .values({
        uid,
        email,
        displayName: displayName || null,
        photoUrl: photoUrl || null,
      })
      .onConflictDoUpdate({
        target: users.uid,
        set: {
          email,
          ...(displayName ? { displayName } : {}),
          ...(photoUrl ? { photoUrl } : {}),
          updatedAt: new Date(),
        },
      })
      .returning();

    return result[0];
  } catch (error) {
    console.error("Database user upsert failed:", error);
    throw new Error("Failed to synchronize user in database", { cause: error });
  }
}

export async function getUserByUid(uid: string) {
  try {
    const res = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    return res[0] || null;
  } catch (error) {
    console.error("Database query failed:", error);
    throw new Error("Database query failed. Please try again later.", { cause: error });
  }
}

export async function updateUserProfile(
  uid: string, 
  data: {
    displayName?: string;
    classGrade?: string;
    board?: string;
    targetExam?: string;
    studyStreak?: number;
  }
) {
  try {
    const result = await db.update(users)
      .set({
        ...data,
        updatedAt: new Date(),
      })
      .where(eq(users.uid, uid))
      .returning();
    return result[0];
  } catch (error) {
    console.error("Database user update failed:", error);
    throw new Error("Failed to update user profile in database", { cause: error });
  }
}

export async function getUserStudyData(uid: string) {
  try {
    const user = await getUserByUid(uid);
    if (!user) return null;

    const userTasks = await db.select().from(tasks).where(eq(tasks.userId, user.id));
    const sessions = await db.select().from(studySessions).where(eq(studySessions.userId, user.id)).orderBy(desc(studySessions.createdAt)).limit(10);
    const quizzes = await db.select().from(quizRecords).where(eq(quizRecords.userId, user.id)).orderBy(desc(quizRecords.createdAt)).limit(10);

    return {
      user,
      tasks: userTasks,
      sessions,
      quizzes,
    };
  } catch (error) {
    console.error("Failed to fetch user study data:", error);
    throw new Error("Failed to fetch user study data", { cause: error });
  }
}

export async function logUserStudySession(
  uid: string,
  session: { subject: string; topic: string; durationMinutes: number; notes?: string }
) {
  try {
    const user = await getUserByUid(uid);
    if (!user) throw new Error("User not found");

    const result = await db.insert(studySessions)
      .values({
        userId: user.id,
        subject: session.subject,
        topic: session.topic,
        durationMinutes: session.durationMinutes,
        notes: session.notes || null,
      })
      .returning();
    return result[0];
  } catch (error) {
    console.error("Failed to log study session:", error);
    throw new Error("Failed to log study session", { cause: error });
  }
}
