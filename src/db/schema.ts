import { relations } from 'drizzle-orm';
import { boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

// Primary Users Table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(), // Firebase Auth UID
  email: text('email').notNull(),
  displayName: text('display_name'),
  photoUrl: text('photo_url'),
  classGrade: text('class_grade'),
  board: text('board'),
  targetExam: text('target_exam'),
  studyStreak: integer('study_streak').default(1),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

// Study Sessions Table
export const studySessions = pgTable('study_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  subject: text('subject').notNull(),
  topic: text('topic').notNull(),
  durationMinutes: integer('duration_minutes').notNull().default(0),
  notes: text('notes'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Student Learning Tasks Table
export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  title: text('title').notNull(),
  subject: text('subject').notNull(),
  difficulty: text('difficulty').default('Medium'),
  progress: integer('progress').default(0),
  isCompleted: boolean('is_completed').default(false),
  route: text('route').default('/student'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Quiz Results / Assessment History Table
export const quizRecords = pgTable('quiz_records', {
  id: serial('id').primaryKey(),
  userId: integer('user_id')
    .references(() => users.id)
    .notNull(),
  subject: text('subject').notNull(),
  topic: text('topic').notNull(),
  score: integer('score').notNull(),
  totalQuestions: integer('total_questions').notNull(),
  accuracy: integer('accuracy').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  studySessions: many(studySessions),
  tasks: many(tasks),
  quizRecords: many(quizRecords),
}));

export const studySessionsRelations = relations(studySessions, ({ one }) => ({
  user: one(users, {
    fields: [studySessions.userId],
    references: [users.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  user: one(users, {
    fields: [tasks.userId],
    references: [users.id],
  }),
}));

export const quizRecordsRelations = relations(quizRecords, ({ one }) => ({
  user: one(users, {
    fields: [quizRecords.userId],
    references: [users.id],
  }),
}));
