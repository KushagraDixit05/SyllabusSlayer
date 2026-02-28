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
  Row,
  Column,
} from '@react-email/components'

interface WeeklySummaryEmailProps {
  userName: string
  playlistsCompleted: number
  hoursLearned: number
  currentStreak: number
  insights: string[]
}

export function WeeklySummaryEmail({
  userName,
  playlistsCompleted,
  hoursLearned,
  currentStreak,
  insights,
}: WeeklySummaryEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your weekly learning summary is here!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={content}>
            <Heading style={h1}>📊 Your Weekly Summary</Heading>

            <Text style={text}>Hi {userName},</Text>
            <Text style={text}>
              Here&apos;s a look at your learning progress this week. Keep up the great work!
            </Text>

            {/* Stats Row */}
            <Section style={statsBox}>
              <Row>
                <Column style={statColumn}>
                  <Text style={statNumber}>{playlistsCompleted}</Text>
                  <Text style={statLabel}>Playlists Completed</Text>
                </Column>
                <Column style={statColumn}>
                  <Text style={statNumber}>{hoursLearned}h</Text>
                  <Text style={statLabel}>Hours Learned</Text>
                </Column>
                <Column style={statColumn}>
                  <Text style={statNumber}>🔥 {currentStreak}</Text>
                  <Text style={statLabel}>Day Streak</Text>
                </Column>
              </Row>
            </Section>

            {/* Insights */}
            {insights.length > 0 && (
              <Section>
                <Heading style={h2}>💡 This Week&apos;s Insights</Heading>
                {insights.map((insight, index) => (
                  <Text key={index} style={insightText}>
                    • {insight}
                  </Text>
                ))}
              </Section>
            )}

            <Button style={button} href="https://syllabusslayer.com/dashboard">
              Continue Learning →
            </Button>

            <Hr style={hr} />
            <Text style={footer}>
              You received this email because you have weekly summary emails enabled.
              Manage your preferences in{' '}
              <a href="https://syllabusslayer.com/dashboard/settings" style={link}>
                account settings
              </a>
              .
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
  margin: '32px 0 16px',
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '16px 0',
}

const statsBox = {
  backgroundColor: '#f8f9fa',
  borderRadius: '12px',
  padding: '24px',
  margin: '24px 0',
}

const statColumn = {
  textAlign: 'center' as const,
  padding: '0 16px',
}

const statNumber = {
  color: '#6366f1',
  fontSize: '32px',
  fontWeight: 'bold' as const,
  margin: '0 0 4px',
  textAlign: 'center' as const,
}

const statLabel = {
  color: '#666',
  fontSize: '12px',
  margin: '0',
  textAlign: 'center' as const,
}

const insightText = {
  color: '#444',
  fontSize: '15px',
  lineHeight: '22px',
  margin: '8px 0',
  paddingLeft: '8px',
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

const link = {
  color: '#6366f1',
  textDecoration: 'underline',
}
