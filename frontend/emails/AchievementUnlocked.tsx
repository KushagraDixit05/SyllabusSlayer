import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
  Hr,
} from '@react-email/components'

interface AchievementUnlockedEmailProps {
  userName: string
  achievementName: string
  achievementDescription: string
  achievementIcon: string
}

export function AchievementUnlockedEmail({
  userName,
  achievementName,
  achievementDescription,
  achievementIcon,
}: AchievementUnlockedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>You unlocked a new achievement: {achievementName}!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Heading style={h1}>🎉 Achievement Unlocked!</Heading>

            <Text style={text}>Hi {userName},</Text>
            <Text style={text}>
              Congratulations! You just unlocked a new achievement on Syllabus Slayer.
            </Text>

            <Section style={achievementBox}>
              <Text style={iconBox}>{achievementIcon}</Text>
              <Heading style={h2}>{achievementName}</Heading>
              <Text style={description}>{achievementDescription}</Text>
            </Section>

            <Text style={text}>
              Keep up the amazing work! Check your dashboard to see all your achievements and
              discover what&apos;s next.
            </Text>

            <Button style={button} href="https://syllabusslayer.com/dashboard/achievements">
              View All Achievements
            </Button>

            <Hr style={hr} />
            <Text style={footer}>
              You received this email because you have achievement notifications enabled.
              You can manage your email preferences in your account settings.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  )
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
  borderRadius: '8px',
}

const content = {
  padding: '0 48px',
}

const h1 = {
  color: '#333',
  fontSize: '28px',
  fontWeight: 'bold' as const,
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold' as const,
  margin: '16px 0 8px',
  textAlign: 'center' as const,
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const achievementBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '12px',
  padding: '32px',
  textAlign: 'center' as const,
  margin: '24px 0',
  border: '2px solid #e9ecef',
}

const iconBox = {
  fontSize: '64px',
  margin: '0 0 8px',
  lineHeight: '1',
  textAlign: 'center' as const,
}

const description = {
  color: '#666',
  fontSize: '14px',
  margin: '8px 0 0',
  textAlign: 'center' as const,
}

const button = {
  backgroundColor: '#6366f1',
  borderRadius: '6px',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: 'bold' as const,
  textDecoration: 'none',
  padding: '12px 24px',
  display: 'block',
  textAlign: 'center' as const,
  margin: '24px 0',
}

const hr = {
  borderColor: '#e9ecef',
  margin: '32px 0 16px',
}

const footer = {
  color: '#999',
  fontSize: '12px',
  lineHeight: '18px',
}
