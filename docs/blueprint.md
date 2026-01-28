# **App Name**: Velocity Clash

## Core Features:

- Player Profile Input: Input fields for player names, finishing position, total points, power-up hits, and lap time/speed rank.
- Match Results Logic: Calculate match results, including titles like 'Match Winner,' 'Most Shooter,' 'Fastest Driver,' and 'Power Master,' based on the provided scoring and badge/title logic.
- Title Assignment (AI Tool): The LLM uses its reasoning tool to decide if the title (badge) should be awarded or not.
- Results Display: Display player stats, assigned titles/badges, and short Blur-style comments praising player performance.
- Weekly Leaderboard: Store match results in Firestore and add points to a weekly leaderboard. Display the player of the week based on total weekly points.
- Data Storage: Store match results and calculate points for the weekly leaderboard using Firestore.
- Winning Player Display: Display top player on the leaderboard

## Style Guidelines:

- Primary color: Electric purple (#BE29EC) to reflect the fast-paced and futuristic racing environment.
- Background color: Dark navy (#1A202C) provides contrast and highlights the neon elements.
- Accent color: Neon green (#39FF14) for interactive elements and call-to-actions.
- Font for headlines: 'Poppins', sans-serif, for headlines, to convey a precise and fashionable look
- Font for body text: 'PT Sans', sans-serif, to guarantee readability of longer pieces of text
- Use neon-outlined icons for power-ups and performance badges, in a style similar to Blur.
- Split-screen layout for match stats and results. Leaderboard with clear player rankings.
- Neon glowing effects and animated transitions for UI elements. Particle effects during result celebrations.