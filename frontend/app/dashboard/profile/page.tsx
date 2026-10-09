import { auth } from '@/lib/auth'
import { userRepository } from '@/lib/repositories/userRepository'
import { playlistRepository } from '@/lib/repositories/playlistRepository'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatTile } from '@/components/ui/stat-tile'
import { PageHeader } from '@/components/dashboard/PageHeader'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { xpForNextLevel, levelForXp } from '@/lib/gamification/xpCurve'
import { cn } from '@/lib/utils'
import {
    BookOpen,
    CheckCircle2,
    Clock,
    Flame,
    Trophy,
    Mail,
    Settings,
    PlayCircle,
} from 'lucide-react'

export default async function ProfilePage() {
    const session = await auth()
    if (!session?.user?.id) return notFound()

    const [userProfile, allPlaylists] = await Promise.all([
        userRepository.getProfile(session.user.id),
        playlistRepository.getByUserId(session.user.id),
    ])

    const completedPlaylists = allPlaylists.filter((p) => p.status === 'completed').length
    const activePlaylists = allPlaylists.filter((p) => p.status === 'in_progress').length

    const xp = userProfile?.xp ?? 0
    const level = levelForXp(xp)
    const { current, needed } = xpForNextLevel(xp)
    const xpProgress = needed > 0 ? Math.min(100, Math.round((current / needed) * 100)) : 100

    const stats = [
        {
            label: 'Total Playlists',
            value: userProfile?.total_playlists_created || 0,
            icon: BookOpen,
            tone: 'brand' as const,
        },
        {
            label: 'Completed',
            value: completedPlaylists,
            icon: CheckCircle2,
            tone: 'success' as const,
        },
        {
            label: 'Hours Learned',
            value: Math.round((userProfile?.total_hours_completed || 0) * 10) / 10,
            icon: Clock,
            tone: 'rare' as const,
        },
        {
            label: 'Current Streak',
            value: userProfile?.current_streak || 0,
            suffix: ' days',
            icon: Flame,
            tone: 'flame' as const,
            highlight: true,
        },
        {
            label: 'Longest Streak',
            value: userProfile?.longest_streak || 0,
            suffix: ' days',
            icon: Trophy,
            tone: 'flame' as const,
        },
        {
            label: 'Active Playlists',
            value: activePlaylists,
            icon: PlayCircle,
            tone: 'brand' as const,
        },
    ]

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <PageHeader
                eyebrow="Operator"
                title="Profile"
                description="Your learning profile and stats"
            />

            {/* User Info Card */}
            <Card variant="elevated" className="overflow-hidden">
                <CardContent className="flex flex-col gap-6 pt-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-5">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={session.user.image || undefined} alt={session.user.name || ''} />
                            <AvatarFallback className="bg-primary font-display text-2xl font-black text-primary-foreground">
                                {session.user.name?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h2 className="font-display text-2xl font-black tracking-tight">
                                {userProfile?.display_name || session.user.name}
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-3.5 w-3.5" />
                                {session.user.email}
                            </div>
                            {userProfile?.bio && (
                                <p className="text-sm text-muted-foreground mt-2 max-w-md">{userProfile.bio}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2 flex-wrap">
                                {userProfile?.leaderboard_opt_in && userProfile.leaderboard_username && (
                                    <Badge variant="secondary">
                                        🏆 Leaderboard: {userProfile.leaderboard_username}
                                    </Badge>
                                )}
                                <Badge variant="outline">
                                    Member since{' '}
                                    {new Date(userProfile?.created_at || Date.now()).toLocaleDateString('en-US', {
                                        month: 'short',
                                        year: 'numeric',
                                    })}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Progression panel */}
                    <div className="rounded-lg w-full shrink-0 border-[3px] border-ink bg-background p-4 sm:w-64">
                        <div className="mb-2 flex items-center justify-between">
                            <p className="text-xs font-bold text-muted-foreground">
                                Progression
                            </p>
                            <Badge>Lvl {level}</Badge>
                        </div>
                        <Progress value={xpProgress} />
                        <div className="mt-2 flex items-center justify-between text-sm font-medium text-muted-foreground">
                            <span>
                                {current.toLocaleString()} / {needed.toLocaleString()} XP
                            </span>
                            <span>to level {level + 1}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div>
                <h3 className="mb-4 border-b-[3px] border-ink pb-2 font-display text-xl font-black tracking-tight">Your Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {stats.map((stat) => (
                        <StatTile
                            key={stat.label}
                            label={stat.label}
                            value={stat.value}
                            suffix={stat.suffix}
                            icon={stat.icon}
                            tone={stat.tone}
                            glow={stat.highlight}
                        />
                    ))}
                </div>
            </div>

            {/* Preferences */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Preferences</CardTitle>
                    <Button asChild variant="outline" size="sm">
                        <Link href="/dashboard/settings">
                            <Settings className="mr-2 h-3.5 w-3.5" />
                            Edit in Settings
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Preferred Speed</span>
                        <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-medium">
                            {userProfile?.preferred_speed || 1}×
                        </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Theme</span>
                        <span className="flex items-center gap-1.5 font-medium capitalize">
                            <span className="rounded-full h-2 w-2 border-[3px] border-ink bg-primary" />
                            {userProfile?.theme_preference || 'system'}
                        </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Timezone</span>
                        <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-medium">
                            {userProfile?.timezone || 'UTC'}
                        </span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Email Notifications</span>
                        <Badge
                            variant="outline"
                            className={cn(
                                userProfile?.email_notifications
                                    ? 'border-chart-5/40 bg-chart-5/15 text-chart-5'
                                    : 'text-muted-foreground'
                            )}
                        >
                            <span className={cn('mr-1.5 h-2 w-2 border-[3px] border-ink', userProfile?.email_notifications ? 'bg-chart-3' : 'bg-muted-foreground')} />
                            {userProfile?.email_notifications ? 'Enabled' : 'Disabled'}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
