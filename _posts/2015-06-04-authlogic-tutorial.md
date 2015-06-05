---
layout: post
title: "Authlogic Tutorial"
date: 2015-06-04 16:34:54
---

[Authlogic](https://github.com/binarylogic/authlogic) is one of Ruby on Rails
authentication solution, its clean, simple, and unobtrusive. Authlogic doesn't
generate anything its only handle the code for the users authentication.

In this tutorial I will show you how to install Authlogic into your Rails
application.

## Gemfile
Add these gems to your Gemfile. By defaults authlogic (> 3.4.0) use SCrypt for
encrypting password.

```ruby
gem 'authlogic'
gem 'bcrypt'    # If using bcrypt
```

## User Model
Generate user model and add some columns into users table.

```ruby
class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :login,               null: false, index: true, unique: true
      t.string :email,               null: false, index: true, unique: true
      t.string :crypted_password,    null: false
      t.string :password_salt,       null: false
      t.string :persistence_token,   null: false
      t.string :single_access_token, null: false
      t.string :perishable_token,    null: false

      # Magic columns, just like ActiveRecord's created_at and updated_at.
      # These are automatically maintained by Authlogic if they are present.
      t.integer   :login_count,         null: false, default: 0
      t.integer   :failed_login_count,  null: false, default: 0
      t.datetime  :last_request_at
      t.datetime  :current_login_at
      t.datetime  :last_login_at
      t.string    :current_login_ip
      t.string    :last_login_ip

      t.timestamps null: false
    end
  end
end
```

We are going to allow users to login using either username or email. The magic
columns are automatically maintained by authlogic. Run `rake db:migrate` and
edit `user.rb`.

```ruby
Class User < ActiveRecord::Base
  acts_as_authentic do |c|
    c.crypto_provider = Authlogic::CryptoProviders::BCrypt
    # If you are going to use SCrypt, change BCrypt to SCrypt
    # Other configuration goes here
  end
end
```

Configuration block in `acts_as_authentic` is optional, you can just leave it
without block and get default configuration. This handles validations to. You
can read more on [authlogic documentation](http://www.rubydoc.info/github/binarylogic/authlogic/Authlogic/ActsAsAuthentic).

## Current User

We are to define the current user method in `ApplicationController`.

```ruby
# app/controllers/application_controller.rb

...

private

def current_user_session
  @current_user_session ||= UserSession.find
  # We will create UserSession class later
end

def current_user
  @current_user ||= current_user_session && current_user_session.record
end

def require_login
  redirect_to login_path unless current_user
end
```

## Session for User Model
Under `model` folder, create `user_session.rb`.

```ruby
class UserSession < Authlogic::Session::Base
  # Authlogic session

  # Login using login or email
  find_by_login_method :find_by_login_or_email
end
```

In user model define `find_by_login_or_email` method.

```ruby
# app/models/user.rb

...

def self.find_by_login_or_email(login)
  find_by_login(login) || find_by_email(login)
end
```
