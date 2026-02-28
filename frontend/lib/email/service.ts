import { resend, SENDER_EMAIL } from './client'
import { AchievementUnlockedEmail } from '@/emails/AchievementUnlocked'
import { WeeklySummaryEmail } from '@/emails/WeeklySummary'

export class EmailService {
  async sendAchievementUnlocked(
    userEmail: string,
    userName: string,
    achievement: {
      name: string
      description: string
      icon: string
    }
  ): Promise<void> {
    try {
      await resend.emails.send({
        from: SENDER_EMAIL,
        to: userEmail,
        subject: `🎉 Achievement Unlocked: ${achievement.name}`,
        react: AchievementUnlockedEmail({
          userName,
          achievementName: achievement.name,
          achievementDescription: achievement.description,
          achievementIcon: achievement.icon,
        }),
      })
    } catch (error) {
      console.error('Failed to send achievement email:', error)
    }
  }

  async sendWeeklySummary(
    userEmail: string,
    userName: string,
    summary: {
      playlistsCompleted: number
      hoursLearned: number
      currentStreak: number
      insights: string[]
    }
  ): Promise<void> {
    try {
      await resend.emails.send({
        from: SENDER_EMAIL,
        to: userEmail,
        subject: 'Your Weekly Learning Summary 📊',
        react: WeeklySummaryEmail({
          userName,
          ...summary,
        }),
      })
    } catch (error) {
      console.error('Failed to send weekly summary email:', error)
    }
  }

  async sendStreakReminder(
    userEmail: string,
    userName: string,
    currentStreak: number
  ): Promise<void> {
    try {
      await resend.emails.send({
        from: SENDER_EMAIL,
        to: userEmail,
        subject: `🔥 Keep your ${currentStreak}-day streak alive!`,
        react: WeeklySummaryEmail({
          userName,
          playlistsCompleted: 0,
          hoursLearned: 0,
          currentStreak,
          insights: [
            `You're on a ${currentStreak}-day streak! Log in today to keep it going.`,
            'Consistent daily habits are the key to mastering any subject.',
          ],
        }),
      })
    } catch (error) {
      console.error('Failed to send streak reminder email:', error)
    }
  }
}

export const emailService = new EmailService()
