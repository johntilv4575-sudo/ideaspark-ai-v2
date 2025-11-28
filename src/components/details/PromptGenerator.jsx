import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { 
    Code, 
    Lightbulb, 
    Copy, 
    Zap,
    Target,
    Settings
} from "lucide-react";

const TECH_STACKS = {
    'react-node': {
        name: 'React + Node.js',
        icon: '⚛️',
        frontend: 'React.js with TypeScript',
        backend: 'Node.js + Express.js',
        database: 'PostgreSQL with Prisma ORM',
        deployment: 'Vercel (frontend) + AWS/Railway (backend)',
        description: 'Modern full-stack JavaScript development'
    },
    'nextjs': {
        name: 'Next.js Full-Stack',
        icon: '▲',
        frontend: 'Next.js 14 with App Router',
        backend: 'Next.js API Routes + Server Actions',
        database: 'PostgreSQL with Prisma or Drizzle ORM',
        deployment: 'Vercel or AWS Amplify',
        description: 'Full-stack React framework with server-side rendering'
    },
    'python-django': {
        name: 'Python + Django',
        icon: '🐍',
        frontend: 'React.js or Vue.js',
        backend: 'Django + Django REST Framework',
        database: 'PostgreSQL',
        deployment: 'AWS/GCP with Docker',
        description: 'Powerful Python web framework with batteries included'
    },
    'python-flask': {
        name: 'Python + Flask',
        icon: '🌶️',
        frontend: 'React.js or vanilla JavaScript',
        backend: 'Flask + SQLAlchemy',
        database: 'PostgreSQL or MongoDB',
        deployment: 'AWS/GCP with Docker',
        description: 'Lightweight Python microframework for flexibility'
    },
    'vue-node': {
        name: 'Vue.js + Node.js',
        icon: '💚',
        frontend: 'Vue.js 3 with Composition API',
        backend: 'Node.js + Express.js',
        database: 'PostgreSQL or MongoDB',
        deployment: 'Netlify (frontend) + AWS/Railway (backend)',
        description: 'Progressive JavaScript framework with intuitive API'
    },
    'ruby-rails': {
        name: 'Ruby on Rails',
        icon: '💎',
        frontend: 'Rails Views + Hotwire/Stimulus',
        backend: 'Ruby on Rails',
        database: 'PostgreSQL',
        deployment: 'Heroku or AWS',
        description: 'Convention over configuration full-stack framework'
    },
    'dotnet': {
        name: '.NET + React',
        icon: '🔷',
        frontend: 'React.js with TypeScript',
        backend: 'ASP.NET Core',
        database: 'SQL Server or PostgreSQL',
        deployment: 'Azure or AWS',
        description: 'Enterprise-grade Microsoft stack'
    },
    'mobile-react-native': {
        name: 'React Native (Mobile)',
        icon: '📱',
        frontend: 'React Native with Expo',
        backend: 'Node.js + Express or Firebase',
        database: 'Firebase or PostgreSQL',
        deployment: 'App Store + Google Play',
        description: 'Cross-platform mobile app development'
    },
    'mobile-flutter': {
        name: 'Flutter (Mobile)',
        icon: '🦋',
        frontend: 'Flutter with Dart',
        backend: 'Node.js, Python, or Firebase',
        database: 'Firebase or PostgreSQL',
        deployment: 'App Store + Google Play',
        description: 'Google\'s UI toolkit for mobile, web, and desktop'
    }
};

export default function PromptGenerator({ concept, industry }) {
    const [activeTab, setActiveTab] = useState('architect');
    const [selectedStack, setSelectedStack] = useState('react-node');

    const generateArchitectPrompt = (concept, stack) => {
        const techStack = TECH_STACKS[stack];
        const conceptName = concept.concept_name || 'App Concept';
        const coreSolution = concept.core_solution || 'Core solution to be defined';
        const competitiveAdvantage = concept.competitive_advantage || 'Competitive advantage to be defined';
        const painPoints = concept.target_pain_points || [];
        const keyFeatures = concept.key_features || [];
        const complexity = concept.development_complexity || 'medium';
        const potential = concept.market_potential || 'moderate';
        const industryName = industry || 'general';

        return `# MASTER PROMPT ARCHITECT - ${conceptName}
## Technology Stack: ${techStack.name}

## ROLE & CONTEXT
You are a Senior Product Architect specializing in ${industryName} applications using ${techStack.name}. Your mission is to design a comprehensive solution for "${conceptName}" that directly addresses validated user pain points through innovative technology.

## VALIDATED PAIN POINTS TO SOLVE
${painPoints.length > 0 ? painPoints.map((point, i) => `${i + 1}. ${point}`).join('\n') : 'No specific pain points provided'}

## CORE SOLUTION MANDATE
${coreSolution}

## COMPETITIVE ADVANTAGE REQUIREMENTS
${competitiveAdvantage}

## ARCHITECTURE TASKS

### 1) TECHNICAL ARCHITECTURE (${techStack.name})

**Frontend Architecture:**
- **Technology**: ${techStack.frontend}
- Design component-based architecture
- State management strategy (Context API, Redux, Zustand, or Pinia)
- Routing and navigation structure
- API integration patterns
- Responsive design system

**Backend Architecture:**
- **Technology**: ${techStack.backend}
- RESTful API design or GraphQL schema
- Authentication & authorization system
- Business logic organization
- Error handling & validation
- Rate limiting & security measures

**Database Design:**
- **Technology**: ${techStack.database}
- Entity-relationship diagrams
- Data models and schemas
- Indexing strategy for performance
- Migration strategy
- Backup and recovery plans

**Deployment Strategy:**
- **Platform**: ${techStack.deployment}
- CI/CD pipeline setup
- Environment management (dev, staging, production)
- Monitoring and logging
- Scalability considerations for ${potential} market potential

### 2) USER EXPERIENCE DESIGN
- Create user flows that eliminate each identified pain point
- Design intuitive interfaces that require minimal learning curve
- Implement progressive disclosure for complex features
- Ensure responsive design across all devices
- Accessibility compliance (WCAG 2.1 AA minimum)

### 3) FEATURE PRIORITIZATION
Core Features to Implement:
${keyFeatures.length > 0 ? keyFeatures.map((feature, i) => `${i + 1}. ${feature}`).join('\n') : 'No specific features provided'}

Create a 3-tier implementation plan:
- **MVP** (Minimum Viable Product) - 4-6 weeks
  * Core pain point solutions
  * Essential user flows
  * Basic analytics
  
- **Growth Phase** - 3-4 months  
  * Advanced features
  * Performance optimization
  * Enhanced user experience
  
- **Scale Phase** - 6-12 months
  * Enterprise features
  * Advanced analytics
  * Multi-region deployment

### 4) BUSINESS VALIDATION
- Define key success metrics for each pain point addressed
- Create user testing scenarios
- Plan A/B testing for core features
- Outline monetization strategy aligned with value delivery
- Set performance benchmarks (e.g., <200ms API response, 99.9% uptime)

### 5) RISK MITIGATION (${complexity} complexity project)
**Technical Risks:**
- Third-party service dependencies
- Scalability bottlenecks
- Data migration challenges
- Security vulnerabilities

**Mitigation Strategies:**
- Fallback mechanisms for critical features
- Load testing and performance monitoring
- Security audits and penetration testing
- Documentation and knowledge transfer

## TECHNOLOGY-SPECIFIC CONSIDERATIONS

**${techStack.name} Best Practices:**
${stack === 'react-node' ? `
- Use React Server Components for improved performance
- Implement proper error boundaries
- Optimize bundle size with code splitting
- Use TypeScript for type safety
- Implement proper caching strategies
` : stack === 'nextjs' ? `
- Leverage Server Components and Server Actions
- Implement ISR (Incremental Static Regeneration)
- Use Metadata API for SEO optimization
- Optimize images with next/image
- Implement proper data fetching patterns
` : stack === 'python-django' ? `
- Follow Django's MVT pattern strictly
- Use Django's ORM efficiently with select_related/prefetch_related
- Implement proper middleware for cross-cutting concerns
- Use Django Rest Framework serializers effectively
- Leverage Django's built-in admin for rapid development
` : stack === 'python-flask' ? `
- Organize with Blueprints for modularity
- Use Flask-SQLAlchemy for database operations
- Implement proper application factory pattern
- Use Flask-Migrate for database migrations
- Leverage Flask extensions for common functionality
` : stack === 'vue-node' ? `
- Use Composition API for better code organization
- Implement proper component composition
- Use Pinia for state management
- Optimize with Vue's built-in lazy loading
- Leverage Vue Router for navigation
` : stack === 'ruby-rails' ? `
- Follow Rails conventions strictly
- Use Active Record associations effectively
- Implement proper concerns for code reuse
- Use Rails engines for large applications
- Leverage Hotwire for modern frontend interactions
` : stack === 'dotnet' ? `
- Follow Clean Architecture principles
- Use Entity Framework Core with proper migrations
- Implement dependency injection throughout
- Use ASP.NET Core middleware pipeline effectively
- Leverage built-in authentication and authorization
` : stack === 'mobile-react-native' ? `
- Use Expo for rapid development and deployment
- Implement proper navigation with React Navigation
- Optimize performance with React Native's profiling tools
- Use native modules only when necessary
- Implement proper offline-first architecture
` : stack === 'mobile-flutter' ? `
- Follow Flutter's widget composition pattern
- Use BLoC or Riverpod for state management
- Implement proper null safety
- Optimize with const widgets where possible
- Use Flutter's built-in animation framework
` : ''}

## DELIVERABLES REQUIRED
1. System Architecture Diagram (with ${techStack.name} components)
2. Database Schema (${techStack.database})
3. API Specification Document
4. Component/Module Structure
5. User Journey Maps
6. Feature Specification Document
7. Technical Requirements Document
8. Project Timeline with Milestones
9. Risk Assessment Matrix

## SUCCESS CRITERIA
- Each pain point has a measurable solution
- User satisfaction increase of 40%+ in target areas
- Technical architecture supports ${potential} market demand
- MVP ready for user testing within 6 weeks
- Performance meets or exceeds industry standards
- Code quality maintained with automated testing (80%+ coverage)

Execute this architecture plan with precision using ${techStack.name} best practices.`;
    };

    const generateBuilderPrompt = (concept, stack) => {
        const techStack = TECH_STACKS[stack];
        const conceptName = concept.concept_name || 'App Concept';
        const coreSolution = concept.core_solution || 'Core solution to be defined';
        const competitiveAdvantage = concept.competitive_advantage || 'Competitive advantage to be defined';
        const painPoints = concept.target_pain_points || [];
        const keyFeatures = concept.key_features || [];
        const complexity = concept.development_complexity || 'medium';
        const potential = concept.market_potential || 'moderate';
        const industryName = industry || 'general';

        return `# MASTER APP BUILDER - ${conceptName}
## Technology Stack: ${techStack.name}

## MISSION BRIEFING
Build "${conceptName}" - a ${industryName} application using ${techStack.name} that revolutionizes user experience by eliminating these critical pain points:

${painPoints.length > 0 ? painPoints.map((point, i) => `🎯 PAIN POINT ${i + 1}: ${point}`).join('\n') : 'Pain points to be defined'}

## BUILD SPECIFICATIONS

### TECHNOLOGY STACK - ${techStack.name} (${complexity.toUpperCase()} COMPLEXITY)

**Frontend Stack:**
- **Core**: ${techStack.frontend}
- **Styling**: Tailwind CSS + shadcn/ui components
- **State Management**: ${stack.includes('react') ? 'Zustand / Redux Toolkit' : stack.includes('vue') ? 'Pinia' : stack.includes('flutter') ? 'BLoC / Riverpod' : 'Built-in state management'}
- **API Layer**: ${stack.includes('graphql') ? 'Apollo Client / URQL' : 'Axios / Fetch API'}
- **Form Handling**: ${stack.includes('react') ? 'React Hook Form + Zod' : stack.includes('vue') ? 'VeeValidate' : 'Native validation'}
- **Testing**: ${stack.includes('react') || stack.includes('vue') ? 'Vitest + React Testing Library' : 'Jest + Testing Library'}

**Backend Stack:**
- **Core**: ${techStack.backend}
- **API Type**: RESTful API with OpenAPI/Swagger documentation
- **Authentication**: JWT-based auth with refresh tokens
- **File Upload**: ${stack.includes('node') ? 'Multer' : stack.includes('python') ? 'Boto3 for S3' : 'Built-in file handling'}
- **Validation**: ${stack.includes('node') ? 'Zod / Joi' : stack.includes('python') ? 'Pydantic' : 'Built-in validation'}
- **Testing**: ${stack.includes('node') ? 'Jest + Supertest' : stack.includes('python') ? 'Pytest' : 'Built-in testing framework'}

**Database Stack:**
- **Primary DB**: ${techStack.database}
- **ORM**: ${stack.includes('node') ? 'Prisma / TypeORM' : stack.includes('django') ? 'Django ORM' : stack.includes('flask') ? 'SQLAlchemy' : stack.includes('rails') ? 'Active Record' : stack.includes('dotnet') ? 'Entity Framework Core' : 'Native database drivers'}
- **Caching**: Redis for session management and performance
- **Search**: ${complexity === 'high' ? 'Elasticsearch for advanced search' : 'Database full-text search'}

**DevOps & Deployment:**
- **Platform**: ${techStack.deployment}
- **Containerization**: Docker + Docker Compose
- **CI/CD**: GitHub Actions / GitLab CI
- **Monitoring**: ${complexity === 'high' ? 'DataDog / New Relic' : 'Built-in platform monitoring'}
- **Logging**: ${stack.includes('node') ? 'Winston' : stack.includes('python') ? 'Python logging' : 'Built-in logging'}

### DEVELOPMENT ENVIRONMENT SETUP

\`\`\`bash
# ${techStack.name} Project Initialization
${stack === 'react-node' ? `
# Frontend
npx create-react-app ${conceptName.toLowerCase().replace(/\\s+/g, '-')}-frontend --template typescript
cd ${conceptName.toLowerCase().replace(/\\s+/g, '-')}-frontend
npm install zustand axios react-router-dom
npm install -D tailwindcss @shadcn/ui

# Backend
mkdir ${conceptName.toLowerCase().replace(/\\s+/g, '-')}-backend && cd ${conceptName.toLowerCase().replace(/\\s+/g, '-')}-backend
npm init -y
npm install express cors dotenv jsonwebtoken bcryptjs
npm install -D typescript @types/node @types/express nodemon
` : stack === 'nextjs' ? `
# Full-stack Next.js project
npx create-next-app@latest ${conceptName.toLowerCase().replace(/\\s+/g, '-')} --typescript --tailwind --app
cd ${conceptName.toLowerCase().replace(/\\s+/g, '-')}
npm install @prisma/client
npm install -D prisma
npx prisma init
` : stack === 'python-django' ? `
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\\Scripts\\activate

# Install Django and dependencies
pip install django djangorestframework django-cors-headers
pip install psycopg2-binary python-decouple

# Create Django project
django-admin startproject ${conceptName.toLowerCase().replace(/\\s+/g, '_')}_backend
cd ${conceptName.toLowerCase().replace(/\\s+/g, '_')}_backend
python manage.py startapp api

# Frontend (separate React app)
npx create-react-app ../frontend --template typescript
` : stack === 'python-flask' ? `
# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install Flask and dependencies
pip install flask flask-sqlalchemy flask-cors flask-jwt-extended
pip install python-dotenv psycopg2-binary

# Create project structure
mkdir ${conceptName.toLowerCase().replace(/\\s+/g, '_')}
cd ${conceptName.toLowerCase().replace(/\\s+/g, '_')}
mkdir app static templates tests
` : stack === 'vue-node' ? `
# Frontend
npm create vue@latest ${conceptName.toLowerCase().replace(/\\s+/g, '-')}-frontend
cd ${conceptName.toLowerCase().replace(/\\s+/g, '-')}-frontend
npm install pinia axios vue-router
npm install -D tailwindcss

# Backend (same as React + Node.js)
mkdir ../${conceptName.toLowerCase().replace(/\\s+/g, '-')}-backend && cd ../${conceptName.toLowerCase().replace(/\\s+/g, '-')}-backend
npm init -y
npm install express cors dotenv jsonwebtoken
` : stack === 'ruby-rails' ? `
# Install Rails (if not installed)
gem install rails

# Create new Rails app with API mode
rails new ${conceptName.toLowerCase().replace(/\\s+/g, '_')} --database=postgresql --api
cd ${conceptName.toLowerCase().replace(/\\s+/g, '_')}

# Add essential gems
bundle add rack-cors jwt bcrypt

# Setup database
rails db:create
` : stack === 'dotnet' ? `
# Create solution and projects
dotnet new sln -n ${conceptName.replace(/\\s+/g, '')}
dotnet new webapi -n ${conceptName.replace(/\\s+/g, '')}.API
dotnet new classlib -n ${conceptName.replace(/\\s+/g, '')}.Core
dotnet new classlib -n ${conceptName.replace(/\\s+/g, '')}.Infrastructure
dotnet sln add **/*.csproj

# Add packages
cd ${conceptName.replace(/\\s+/g, '')}.API
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
` : stack === 'mobile-react-native' ? `
# Create Expo project
npx create-expo-app ${conceptName.toLowerCase().replace(/\\s+/g, '-')}
cd ${conceptName.toLowerCase().replace(/\\s+/g, '-')}
npm install @react-navigation/native @react-navigation/stack
npm install axios zustand
npx expo install react-native-screens react-native-safe-area-context
` : stack === 'mobile-flutter' ? `
# Create Flutter project
flutter create ${conceptName.toLowerCase().replace(/\\s+/g, '_')}
cd ${conceptName.toLowerCase().replace(/\\s+/g, '_')}

# Add dependencies in pubspec.yaml:
# dependencies:
#   flutter_bloc: ^8.1.3
#   http: ^1.1.0
#   shared_preferences: ^2.2.2
#   provider: ^6.1.1

flutter pub get
` : ''}
\`\`\`

### CORE FEATURES IMPLEMENTATION

${keyFeatures.length > 0 ? keyFeatures.map((feature, i) => `
**Feature ${i + 1}: ${feature}**

${stack.includes('react') ? `
\`\`\`typescript
// ${feature.replace(/\\s+/g, '')}Component.tsx
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ${feature.replace(/\\s+/g, '')}Props {
  // Define props based on feature requirements
}

export function ${feature.replace(/\\s+/g, '')}Component({ }: ${feature.replace(/\\s+/g, '')}Props) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Fetch data or initialize feature
  }, []);

  return (
    <Card>
      <CardHeader>
        <h2>{feature}</h2>
      </CardHeader>
      <CardContent>
        {/* Implement feature UI */}
      </CardContent>
    </Card>
  );
}
\`\`\`

\`\`\`typescript
// API route for ${feature}
// pages/api/${feature.toLowerCase().replace(/\\s+/g, '-')}.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    // Implement GET logic
    res.status(200).json({ data: [] });
  } else if (req.method === 'POST') {
    // Implement POST logic
    res.status(201).json({ message: 'Created' });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
\`\`\`
` : stack.includes('python') ? `
\`\`\`python
# views.py or routes.py for ${feature}
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

@api_view(['GET', 'POST'])
def ${feature.toLowerCase().replace(/\\s+/g, '_')}_view(request):
    """
    Handle ${feature} operations
    """
    if request.method == 'GET':
        # Implement GET logic
        return Response({'data': []}, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        # Implement POST logic
        data = request.data
        # Validate and process
        return Response({'message': 'Created'}, status=status.HTTP_201_CREATED)
\`\`\`

\`\`\`python
# models.py for ${feature}
from django.db import models

class ${feature.replace(/\\s+/g, '')}(models.Model):
    # Define model fields
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = '${feature.toLowerCase().replace(/\\s+/g, '_')}'
        ordering = ['-created_at']
    
    def __str__(self):
        return f"${feature} {self.id}"
\`\`\`
` : stack === 'mobile-flutter' ? `
\`\`\`dart
// ${feature.toLowerCase().replace(/\\s+/g, '_')}_screen.dart
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';

class ${feature.replace(/\\s+/g, '')}Screen extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('${feature}'),
      ),
      body: BlocBuilder<${feature.replace(/\\s+/g, '')}Bloc, ${feature.replace(/\\s+/g, '')}State>(
        builder: (context, state) {
          if (state is ${feature.replace(/\\s+/g, '')}Loading) {
            return Center(child: CircularProgressIndicator());
          }
          
          if (state is ${feature.replace(/\\s+/g, '')}Loaded) {
            return ListView.builder(
              itemCount: state.items.length,
              itemBuilder: (context, index) {
                return ListTile(
                  title: Text(state.items[index].title),
                );
              },
            );
          }
          
          return Center(child: Text('No data'));
        },
      ),
    );
  }
}
\`\`\`
` : ''}

- **Pain Point Addressed**: ${painPoints[Math.min(i, painPoints.length - 1)] || 'User frustration'}
- **Success Metric**: [Define measurable improvement]
- **Code Priority**: ${i < 3 ? 'MVP' : i < 6 ? 'Phase 2' : 'Phase 3'}
`).join('') : 'Features to be defined'}

### PAIN POINT ELIMINATION STRATEGY

${painPoints.length > 0 ? painPoints.map((point, i) => `
**Pain Point ${i + 1}**: ${point}

**Technical Solution (${techStack.name}):**
${stack.includes('react') ? `
- Implement real-time updates using WebSockets or Server-Sent Events
- Create intuitive UI components with shadcn/ui
- Optimize performance with React.memo and useMemo
- Add loading states and skeleton screens for better UX
` : stack.includes('python') ? `
- Leverage Django/Flask background tasks with Celery
- Implement efficient database queries with proper indexing
- Create RESTful endpoints with comprehensive error handling
- Use Django channels or Flask-SocketIO for real-time features
` : stack.includes('flutter') ? `
- Implement smooth animations with Flutter's animation framework
- Use BLoC pattern for predictable state management
- Optimize list rendering with ListView.builder
- Add pull-to-refresh and infinite scroll
` : ''}

**UX Solution:**
- Simplify the user flow to maximum 3 steps
- Provide clear feedback for all user actions
- Implement smart defaults to reduce decision fatigue
- Add helpful tooltips and onboarding

**Validation Method:**
- User testing with target demographic
- Analytics tracking for feature usage
- A/B testing different approaches
- Performance monitoring (load times, error rates)
`).join('') : 'Pain points to be mapped'}

### DEVELOPMENT PHASES

#### 🚀 MVP PHASE (4-6 weeks)

**Week 1-2: Foundation**
${stack.includes('react') ? `
- Set up React project with TypeScript
- Configure Tailwind CSS and shadcn/ui
- Set up React Router for navigation
- Create base component library
- Implement authentication flow
- Set up API integration layer with Axios
` : stack.includes('python') ? `
- Set up Django/Flask project structure
- Configure database and run migrations
- Set up Django Rest Framework / Flask-RESTful
- Implement authentication (JWT or Django sessions)
- Create base models and serializers
- Set up CORS for frontend integration
` : stack.includes('flutter') ? `
- Set up Flutter project structure
- Configure state management (BLoC/Provider)
- Set up navigation with named routes
- Create base widgets and theme
- Implement authentication flow
- Set up HTTP client for API calls
` : ''}

**Week 3-4: Core Features**
- Implement top 3 pain-point-solving features
- Basic UI/UX for essential user flows
- Integration with key third-party services
- Error handling and validation
- Loading states and user feedback

**Week 5-6: Testing & Polish**
- Unit testing (aim for 80% coverage)
- Integration testing for critical paths
- User acceptance testing with beta users
- Performance optimization
- Security audit (authentication, authorization, input validation)
- Deployment setup and documentation

#### 📈 GROWTH PHASE (3-4 months)
- Advanced features implementation (features 4-7)
- Analytics and user behavior tracking
- Performance optimization and caching
- Enhanced error handling and logging
- A/B testing infrastructure
- Scale preparation (load testing, database optimization)

#### 🎯 SCALE PHASE (6-12 months)
- Advanced AI/ML features (if applicable)
- Multi-region deployment
- Enterprise features (SSO, advanced permissions)
- Advanced analytics and reporting
- API versioning and deprecation strategy
- White-label capabilities (if relevant)

### COMPETITIVE ADVANTAGE IMPLEMENTATION

**Key Differentiator**: ${competitiveAdvantage}

**Technical Implementation Strategy (${techStack.name}):**
${stack.includes('react') ? `
- Leverage React 18 features (Suspense, Transitions) for superior UX
- Implement optimistic updates for instant feedback
- Use Service Workers for offline capabilities
- Create reusable component library for consistent experience
` : stack.includes('python') ? `
- Leverage Python's data processing capabilities for analytics
- Implement background job processing for heavy operations
- Use Django's ORM efficiently with select_related/prefetch_related
- Create RESTful API with comprehensive documentation
` : stack.includes('flutter') ? `
- Leverage Flutter's rendering engine for 60fps animations
- Implement platform-specific features when beneficial
- Use Flutter's hot reload for rapid iteration
- Create consistent cross-platform experience
` : ''}

### QUALITY ASSURANCE FRAMEWORK

**Testing Strategy:**
\`\`\`bash
# Run all tests
${stack.includes('react') ? 'npm test' : stack.includes('python') ? 'pytest' : stack.includes('flutter') ? 'flutter test' : 'npm test'}

# Run tests with coverage
${stack.includes('react') ? 'npm test -- --coverage' : stack.includes('python') ? 'pytest --cov' : stack.includes('flutter') ? 'flutter test --coverage' : 'npm test -- --coverage'}

# Lint code
${stack.includes('react') ? 'npm run lint' : stack.includes('python') ? 'flake8 . && black . --check' : stack.includes('flutter') ? 'flutter analyze' : 'npm run lint'}
\`\`\`

**Quality Gates:**
1. **Unit Testing**: 80%+ coverage for critical paths
2. **Integration Testing**: All API endpoints tested
3. **E2E Testing**: Critical user journeys automated
4. **Performance Testing**: Load testing for ${potential} market scale
5. **Security Testing**: Regular OWASP Top 10 checks
6. **Accessibility**: WCAG 2.1 AA compliance

### MONITORING & SUCCESS METRICS

**Application Performance Monitoring:**
\`\`\`typescript
// Example monitoring setup
${stack.includes('node') ? `
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
` : stack.includes('python') ? `
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration

sentry_sdk.init(
    dsn=os.getenv('SENTRY_DSN'),
    integrations=[DjangoIntegration()],
    environment=os.getenv('ENVIRONMENT'),
    traces_sample_rate=1.0,
)
` : ''}
\`\`\`

**Key Metrics to Track:**
- Pain Point Resolution Rate: Track reduction in user complaints
- User Satisfaction: NPS score improvement target: +40%
- Performance: 99.9% uptime, <200ms API response times
- Growth: User acquisition and retention rates
- Technical: Error rates, API latency, database query performance

### DEPLOYMENT STRATEGY

**${techStack.deployment} Deployment:**

\`\`\`yaml
# Example CI/CD pipeline (GitHub Actions)
name: Deploy to ${techStack.deployment}

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      ${stack.includes('node') || stack.includes('react') ? `
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build
        run: npm run build
        
      - name: Deploy to Vercel
        run: npx vercel --prod
        env:
          VERCEL_TOKEN: \${{ secrets.VERCEL_TOKEN }}
      ` : stack.includes('python') ? `
      - name: Setup Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
          
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          
      - name: Run tests
        run: pytest
        
      - name: Deploy
        run: |
          # Add your deployment commands here
          # e.g., docker build and push, or platform-specific deployment
      ` : stack.includes('flutter') ? `
      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.16.0'
          
      - name: Install dependencies
        run: flutter pub get
        
      - name: Run tests
        run: flutter test
        
      - name: Build APK
        run: flutter build apk --release
        
      - name: Build iOS
        run: flutter build ios --release --no-codesign
      ` : ''}
\`\`\`

**Environment Configuration:**
- Development: Hot reload, verbose logging, debug mode
- Staging: Mirror of production, integration testing
- Production: Optimized builds, error tracking, performance monitoring

### BUILD EXECUTION CHECKLIST

- [ ] Repository setup with ${techStack.name} best practices
- [ ] CI/CD pipeline configuration
- [ ] Database design and migration scripts
- [ ] API documentation (OpenAPI/Swagger)
- [ ] Component/widget library
- [ ] Authentication system implementation
- [ ] Core features development (${keyFeatures.length} features)
- [ ] Testing suite implementation (unit + integration + e2e)
- [ ] Performance optimization
- [ ] Security implementation (authentication, authorization, input validation)
- [ ] Monitoring and logging setup
- [ ] Deployment configuration
- [ ] User documentation
- [ ] Developer documentation

### ${techStack.name} SPECIFIC BEST PRACTICES

${stack === 'react-node' ? `
**React Best Practices:**
- Use functional components with hooks
- Implement proper error boundaries
- Optimize re-renders with React.memo and useMemo
- Use TypeScript for type safety
- Implement code splitting for better performance

**Node.js Best Practices:**
- Use async/await instead of callbacks
- Implement proper error handling middleware
- Use environment variables for configuration
- Implement rate limiting and security headers
- Use connection pooling for database
` : stack === 'nextjs' ? `
**Next.js Best Practices:**
- Leverage Server Components for better performance
- Use Server Actions for mutations
- Implement ISR for dynamic content
- Optimize images with next/image
- Use Metadata API for SEO
- Implement proper data fetching patterns (no waterfalls)
` : stack === 'python-django' ? `
**Django Best Practices:**
- Follow Django's MVT pattern
- Use select_related and prefetch_related for query optimization
- Implement custom middleware for cross-cutting concerns
- Use Django Rest Framework serializers effectively
- Leverage Django's admin for rapid development
- Use Django signals carefully (avoid overuse)
` : stack === 'python-flask' ? `
**Flask Best Practices:**
- Organize with Blueprints for modularity
- Use application factory pattern
- Implement proper request/response handling
- Use Flask extensions wisely
- Implement comprehensive error handling
- Use Flask-Migrate for database migrations
` : stack === 'vue-node' ? `
**Vue.js Best Practices:**
- Use Composition API for better code organization
- Implement proper component composition
- Use Pinia for predictable state management
- Optimize with computed properties and watchers
- Leverage Vue Router for navigation
- Use Vue 3's Teleport for modals and overlays
` : stack === 'ruby-rails' ? `
**Rails Best Practices:**
- Follow Rails conventions (CoC)
- Use Active Record associations effectively
- Implement concerns for code reuse
- Use service objects for complex business logic
- Leverage Hotwire/Stimulus for modern interactivity
- Write comprehensive tests with RSpec
` : stack === 'dotnet' ? `
**.NET Best Practices:**
- Follow SOLID principles
- Use dependency injection throughout
- Implement repository pattern for data access
- Use Entity Framework Core efficiently
- Implement proper exception handling
- Use asynchronous programming (async/await)
` : stack.includes('mobile') ? `
**Mobile Development Best Practices:**
- Implement offline-first architecture
- Optimize for battery life
- Handle different screen sizes and orientations
- Implement proper deep linking
- Use platform-specific features when beneficial
- Test on real devices, not just emulators
` : ''}

## SUCCESS VALIDATION

**Each feature must demonstrate measurable improvement:**
${painPoints.length > 0 ? painPoints.map((point, i) => `- Pain Point ${i + 1}: [Define specific metric and target improvement percentage]`).join('\n') : 'Metrics to be defined'}

**Technical Success Criteria:**
- All tests passing (unit, integration, e2e)
- Performance benchmarks met (load time, API latency)
- Security audit passed
- Accessibility compliance achieved
- Code quality maintained (linting, formatting)

Build with precision using ${techStack.name}, test rigorously, and ship with confidence. This ${conceptName} will transform how users experience ${industryName} solutions.`;
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text);
        toast.success("Prompt copied to clipboard!");
    };

    const architectPrompt = generateArchitectPrompt(concept, selectedStack);
    const builderPrompt = generateBuilderPrompt(concept, selectedStack);
    const currentStack = TECH_STACKS[selectedStack];

    return (
        <Card className="bg-slate-800/30 backdrop-blur-sm border border-slate-700 rounded-xl overflow-hidden">
            <CardHeader className="border-b border-slate-700 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                        <CardTitle className="text-white flex items-center gap-3 mb-2">
                            <Code className="w-5 h-5 text-blue-400" />
                            Master Development Prompts
                        </CardTitle>
                        <p className="text-slate-400 text-sm">
                            Use these AI prompts with ChatGPT, Claude, or any AI assistant to build this app
                        </p>
                    </div>
                    
                    {/* Technology Stack Selector */}
                    <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-slate-400 flex-shrink-0" />
                        <Select value={selectedStack} onValueChange={setSelectedStack}>
                            <SelectTrigger className="w-[240px] bg-slate-900 border-slate-600 text-white">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-700">
                                {Object.entries(TECH_STACKS).map(([key, stack]) => (
                                    <SelectItem 
                                        key={key} 
                                        value={key}
                                        className="text-white hover:bg-slate-800 cursor-pointer"
                                    >
                                        <span className="flex items-center gap-2">
                                            <span>{stack.icon}</span>
                                            <span>{stack.name}</span>
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                
                {/* Selected Stack Info */}
                <div className="mt-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-300 mb-2">
                        <strong>{currentStack.icon} {currentStack.name}:</strong> {currentStack.description}
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-400">
                        <div><strong className="text-slate-300">Frontend:</strong> {currentStack.frontend}</div>
                        <div><strong className="text-slate-300">Backend:</strong> {currentStack.backend}</div>
                        <div><strong className="text-slate-300">Database:</strong> {currentStack.database}</div>
                        <div><strong className="text-slate-300">Deploy:</strong> {currentStack.deployment}</div>
                    </div>
                </div>
            </CardHeader>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-700 bg-slate-800/50">
                <button
                    type="button"
                    onClick={() => setActiveTab('architect')}
                    className={`flex-1 px-6 py-4 font-semibold transition-all ${
                        activeTab === 'architect'
                            ? 'bg-blue-600/20 text-blue-300 border-b-2 border-blue-500'
                            : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
                    }`}
                >
                    <Lightbulb className="w-4 h-4 inline mr-2" />
                    <span>Architect Prompt</span>
                </button>
                <button
                    type="button"
                    onClick={() => setActiveTab('builder')}
                    className={`flex-1 px-6 py-4 font-semibold transition-all ${
                        activeTab === 'builder'
                            ? 'bg-purple-600/20 text-purple-300 border-b-2 border-purple-500'
                            : 'text-slate-400 hover:text-slate-300 hover:bg-slate-700/30'
                    }`}
                >
                    <Zap className="w-4 h-4 inline mr-2" />
                    <span>Builder Prompt</span>
                </button>
            </div>

            <CardContent className="p-6">
                {activeTab === 'architect' ? (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <Badge className="bg-blue-600/20 text-blue-300 border-blue-500/30">
                                <Target className="w-3 h-3 mr-1" />
                                System Architecture & Planning
                            </Badge>
                            <Button
                                type="button"
                                onClick={() => handleCopy(architectPrompt)}
                                className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                                <Copy className="w-4 h-4 mr-2 text-white" />
                                <span className="text-white">Copy Prompt</span>
                            </Button>
                        </div>
                        <pre className="bg-slate-900 text-slate-200 p-6 rounded-lg overflow-x-auto text-sm leading-relaxed whitespace-pre-wrap border border-slate-700 max-h-[600px] overflow-y-auto">
                            {architectPrompt}
                        </pre>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <Badge className="bg-purple-600/20 text-purple-300 border-purple-500/30">
                                <Zap className="w-3 h-3 mr-1" />
                                Full Stack Development
                            </Badge>
                            <Button
                                type="button"
                                onClick={() => handleCopy(builderPrompt)}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                <Copy className="w-4 h-4 mr-2 text-white" />
                                <span className="text-white">Copy Prompt</span>
                            </Button>
                        </div>
                        <pre className="bg-slate-900 text-slate-200 p-6 rounded-lg overflow-x-auto text-sm leading-relaxed whitespace-pre-wrap border border-slate-700 max-h-[600px] overflow-y-auto">
                            {builderPrompt}
                        </pre>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}