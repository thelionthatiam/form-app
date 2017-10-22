Views and Associated Routes:

account-actions
  /in-session/to-manage-account
  /to-add-payment
  /in-session/shop
  /auth/log-out

create-account
  success: true
    /auth/to-login
    /
  success: false
    /account/create

email-password
   /auth/mailer (change password)

error
  /auth/log-out

index
  /account/to-create
  /auth/to-login
  /an-error

login
  accountDelete: true
    /auth/delete
  accountDelete: false
    /auth/login
    /auth/mailer (change password)

manage account
  /in-session/change-email
  /in-session/to-manage-account (back button)
  /in-session/to-change-email
  /in-session/change-phone
  /in-session/to-manage-account (back button)
  /in-session/to-change-phone
  /auth/change-password
  /in-session/to-manage-account (back button)
  /auth/mailer
  /account/delete
  /in-session/back-account-actions
  /an-error

new - password
  success: true
    /to-login
  success: false
    /auth/change-password

shop
