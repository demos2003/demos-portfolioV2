-- Seeds the tables with the site's current hardcoded content so the public
-- site looks unchanged immediately after migrating to the database.
-- Run this once, after schema.sql, in the Supabase SQL editor.

insert into projects (title, description, image_url, technologies, live_url, display_order) values
  ('Royal Gate Group Website', 'A premium website for Royal Gate a revolutionary food distibution company', '/images/RG.png', array['Next JS','Tailwind','Vite'], 'https://royalgategroup.com.ng/', 0),
  ('LSTML', 'Redesigned and developed the official website for the Lagos State Material Testing Laboratory (LSTML) using Next.js. Integrated a headless CMS for seamless content management by non-technical staff, and added social media integration to improve public engagement. Focused on accessibility, performance, and responsiveness across all devices.', '/images/LSTML.png', array['Next.js','TypeScript','Tailwind'], 'https://lsmtl.lg.gov.ng/', 1),
  ('Ticket Dash', 'An intelligent event booking platform that enables users to seamlessly book, purchase, and redeem event tickets', '/images/TD.png', array['React','Spring boot','React Native','Postgres'], 'https://ticket-pro-web.onrender.com/', 2);

insert into blog_posts (title, excerpt, image_url, post_date, read_time, tags, url, display_order) values
  ('Navigating the Maze of React Hooks: Understanding, Implementing, and Avoiding Pitfalls', 'A deep dive into React Hooks — how they work, best practices for usage, and common mistakes to avoid when managing state and side effects.', '/images/RH.png', 'Jun 26, 2024', '6 min read', array['React','Hooks','JavaScript'], 'https://medium.com/@ladenas202/navigating-the-maze-of-react-hooks-understanding-implementing-and-avoiding-pitfalls-82ba52d7b98d', 0),
  ('Navigating the Maze of React Hooks: Understanding, Implementing, and Avoiding Pitfalls pt.2', 'Explore advanced React Hook patterns, custom hooks, and integrating them with state management tools like Redux and Zustand.', '/images/RH.png', 'Jul 2, 2024', '12 min read', array['React','Custom Hooks','State Management'], 'https://medium.com/@ladenas202/navigating-the-maze-of-react-hooks-understanding-implementing-and-avoiding-pitfalls-pt-2-023b716c7724', 1),
  ('The Developer Mindset', 'Insights on cultivating a problem-solving mindset, writing maintainable code, and continuously improving as a software developer.', '/images/Mindset.png', 'Jul 30, 2024', '10 min read', array['Mindset','Career','Best Practices'], 'https://medium.com/@ladenas202/the-developer-mindset-fb9f60fb4d86', 2),
  ('Mastering Basic Git Operations and Leveraging GitHub for Seamless Code Collaboration', 'Learn the fundamentals of Git — cloning, branching, committing, pushing — and how to use GitHub effectively for team collaboration.', '/images/Git.png', 'Jul 21, 2024', '5 min read', array['Git','GitHub','Version Control'], 'https://medium.com/@ladenas202/mastering-basic-git-operations-and-leveraging-github-for-seamless-code-collaboration-9d6b2225aa88', 3),
  ('A Beginner''s Guide to Essential Data Structures', 'An easy-to-follow introduction to fundamental data structures like arrays, linked lists, stacks, queues, trees, and hash maps — and when to use each.', '/images/DSA.png', 'Jul 21, 2024', '4 min read', array['Data Structures','Algorithms','Computer Science'], 'https://medium.com/@ladenas202/a-beginners-guide-to-essential-data-structures-82fffd7180b8', 4);

with cat as (
  insert into skill_categories (title, color, display_order) values
    ('Frontend', 'from-blue-600 to-purple-600', 0),
    ('Backend', 'from-green-600 to-blue-600', 1),
    ('Database', 'from-purple-600 to-pink-600', 2),
    ('DevOps & Tools', 'from-orange-600 to-red-600', 3)
  returning id, title
)
insert into skills (category_id, name, display_order)
select cat.id, s.name, s.ord
from cat
join (values
  ('Frontend', 'React', 0), ('Frontend', 'Next.js', 1), ('Frontend', 'TypeScript', 2), ('Frontend', 'Tailwind CSS', 3), ('Frontend', 'React Native', 4), ('Frontend', 'Angular', 5),
  ('Backend', 'Node.js', 0), ('Backend', 'Next Js', 1), ('Backend', 'Express.js', 2), ('Backend', 'Spring boot', 3), ('Backend', 'FastAPI', 4), ('Backend', 'GraphQL', 5),
  ('Database', 'PostgreSQL', 0), ('Database', 'MongoDB', 1), ('Database', 'Redis', 2), ('Database', 'MySQL', 3), ('Database', 'Supabase', 4), ('Database', 'Firebase', 5),
  ('DevOps & Tools', 'Docker', 0), ('DevOps & Tools', 'AWS', 1), ('DevOps & Tools', 'Vercel', 2), ('DevOps & Tools', 'Git', 3), ('DevOps & Tools', 'GitHub Actions', 4), ('DevOps & Tools', 'Linux', 5)
) as s(category_title, name, ord) on s.category_title = cat.title;

insert into about_stats (label, value, display_order) values
  ('Projects Completed', '30+', 0),
  ('Years Experience', '4+', 1),
  ('Technologies', '10+', 2),
  ('Client Satisfaction', '100%', 3);

insert into site_settings (key, value) values
  ('about_bio', '[
    "I''m a passionate Full Stack Developer with expertise in modern web technologies. I love creating efficient, scalable, and user-friendly applications that solve real-world problems.",
    "My journey in software development started with curiosity about how things work behind the scenes. Today, I specialize in React, Node.js, Python, and cloud technologies, always staying updated with the latest industry trends.",
    "When I''m not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community."
  ]'::jsonb),
  ('contact_info', '{
    "email": "ladenas202@gmail.com",
    "phone": "09027795800",
    "location": "Lagos, Nigeria"
  }'::jsonb)
on conflict (key) do nothing;
