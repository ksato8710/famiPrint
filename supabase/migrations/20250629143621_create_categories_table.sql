-- Create a table for categories
create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  created_at timestamp with time zone default now()
);

-- Add a foreign key to the prints table
alter table prints
add column category_id uuid references categories(id);

-- Migrate existing categories from prints.category to the new categories table
insert into categories (name)
select distinct category from prints where category is not null;

-- Update existing prints to link to the new categories table
update prints
set category_id = categories.id
from categories
where prints.category = categories.name;

-- Drop the old category column from the prints table
alter table prints
drop column category;
