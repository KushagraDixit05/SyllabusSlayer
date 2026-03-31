import { auth } from '@/lib/auth'
import { userRepository } from '@/lib/repositories/userRepository'
import { playlistRepository } from '@/lib/repositories/playlistRepository'
import { notFound } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    BookOpen,
    CheckCircle2,
    Clock,
    Flame,
    Trophy,
    Calendar,
    Mail,
} from 'lucide-react'

export default async function ProfilePage() {
    const session = await auth()
    if (!session?.user?.id) return notFound()

    const [userProfile, allPlaylists] = await Promise.all([
        userRepository.getProfile(session.user.id),
        playlistRepository.getByUserId(session.user.id),
    ])

    const completedPlaylists = allPlaylists.filter((p) => p.status === 'completed').length
    const activePlaylists = allPlaylists.filter((p) => p.status !== 'completed').length

    const stats = [
        {
            label: 'Total Playlists',
            value: userProfile?.total_playlists_created || 0,
            icon: BookOpen,
            color: 'text-blue-500',
        },
        {
            label: 'Completed',
            value: completedPlaylists,
            icon: CheckCircle2,
            color: 'text-green-500',
        },
        {
            label: 'Hours Learned',
            value: userProfile?.total_hours_completed || 0,
            icon: Clock,
            color: 'text-purple-500',
        },
        {
            label: 'Current Streak',
            value: `${userProfile?.current_streak || 0} days`,
            icon: Flame,
            color: 'text-orange-500',
        },
        {
            label: 'Longest Streak',
            value: `${userProfile?.longest_streak || 0} days`,
            icon: Trophy,
            color: 'text-yellow-500',
        },
        {
            label: 'Active Playlists',
            value: activePlaylists,
            icon: Calendar,
            color: 'text-cyan-500',
        },
    ]

    return (
        <div className="space-y-6 max-w-3xl mx-auto">
            <div>
                <h1 className="text-3xl font-bold">Profile</h1>
                <p className="text-muted-foreground mt-1">Your learning profile and stats</p>
            </div>

            {/* User Info Card */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={session.user.image || undefined} alt={session.user.name || ''} />
                            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-2xl">
                                {session.user.name?.charAt(0).toUpperCase() || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold">
                                {userProfile?.display_name || session.user.name}
                            </h2>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Mail className="h-3.5 w-3.5" />
                                {session.user.email}
                            </div>
                            {userProfile?.bio && (
                                <p className="text-sm text-muted-foreground mt-2">{userProfile.bio}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                                {userProfile?.leaderboard_opt_in && (
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
                </CardContent>
            </Card>

            {/* Stats Grid */}
            <div>
                <h3 className="text-lg font-semibold mb-4">Your Stats</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {stats.map((stat) => (
                        <Card key={stat.label}>
                            <CardContent className="pt-6 pb-4">
                                <div className="flex items-center gap-3">
                                    <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                                        <stat.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>

            {/* Preferences */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Preferred Speed</span>
                        <span className="font-medium">{userProfile?.preferred_speed || 1}×</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Theme</span>
                        <span className="font-medium capitalize">{userProfile?.theme_preference || 'system'}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Timezone</span>
                        <span className="font-medium">{userProfile?.timezone || 'UTC'}</span>
                    </div>
                    <Separator />
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Email Notifications</span>
                        <Badge variant={userProfile?.email_notifications ? 'default' : 'secondary'}>
                            {userProfile?.email_notifications ? 'Enabled' : 'Disabled'}
                        </Badge>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
