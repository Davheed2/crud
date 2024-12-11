#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod crud2 {
    use super::*;

  pub fn close(_ctx: Context<CloseCrud2>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.crud2.count = ctx.accounts.crud2.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.crud2.count = ctx.accounts.crud2.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeCrud2>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.crud2.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeCrud2<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Crud2::INIT_SPACE,
  payer = payer
  )]
  pub crud2: Account<'info, Crud2>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseCrud2<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub crud2: Account<'info, Crud2>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub crud2: Account<'info, Crud2>,
}

#[account]
#[derive(InitSpace)]
pub struct Crud2 {
  count: u8,
}
