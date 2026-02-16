#!/bin/bash

# Phase 3A Setup Script
# Helps you get started quickly with the authentication and database setup

set -e

echo "🎯 Syllabus Slayer - Phase 3A Setup"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -f "frontend/package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Step 1: Environment file
echo "📝 Step 1: Setting up environment variables"
if [ -f "frontend/.env.local" ]; then
    echo "⚠️  .env.local already exists. Skipping..."
else
    cp frontend/.env.example frontend/.env.local
    echo "✅ Created frontend/.env.local from template"
fi

# Step 2: Generate NextAuth secret
echo ""
echo "🔐 Step 2: Generating NextAuth secret"
NEXTAUTH_SECRET=$(openssl rand -base64 32)
echo "Generated secret: $NEXTAUTH_SECRET"
echo "✅ Copy this to your .env.local NEXTAUTH_SECRET"

# Step 3: Checklist
echo ""
echo "📋 Next Steps Checklist:"
echo "========================"
echo ""
echo "[ ] 1. Create Supabase project at https://supabase.com"
echo "[ ] 2. Run SQL from /supabase/schema.sql in Supabase SQL Editor"
echo "[ ] 3. Get Supabase credentials from Project Settings > API:"
echo "        - Project URL"
echo "        - anon/public key"
echo "        - service_role key"
echo "[ ] 4. Setup Google OAuth:"
echo "        - https://console.cloud.google.com/apis/credentials"
echo "        - Create OAuth 2.0 Client ID"
echo "        - Redirect URI: http://localhost:3000/api/auth/callback/google"
echo "[ ] 5. Setup GitHub OAuth:"
echo "        - https://github.com/settings/developers"
echo "        - Create OAuth App"
echo "        - Callback URL: http://localhost:3000/api/auth/callback/github"
echo "[ ] 6. Edit frontend/.env.local with all credentials"
echo "[ ] 7. Run: cd frontend && npm run dev"
echo "[ ] 8. Visit: http://localhost:3000/auth/signin"
echo ""
echo "📚 For detailed instructions, see:"
echo "   - PHASE_3A_README.md"
echo "   - PHASE_3A_CHECKLIST.md"
echo ""
echo "🚀 Your NextAuth secret has been generated above!"
echo "   Don't forget to add it to .env.local"
echo ""
