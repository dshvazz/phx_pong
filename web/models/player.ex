defmodule PhxPong.Player do
  use PhxPong.Web, :model

  alias PhxPong.Game
  alias PhxPong.User

  schema "players" do
    belongs_to :user, User
    belongs_to :game, Game

    field :position, :integer
    field :score,    :integer, default: 0
    field :status,   :string,  default: "normal"
  end

  @required_fields ~w(position score)
  @optional_fields ~w(user_id game_id status)

  @doc """
  Creates a changeset based on the `model` and `params`.

  If no params are provided, an invalid changeset is returned
  with no validation performed.
  """
  def changeset(model, params \\ :empty) do
    model
    |> cast(params, @required_fields, @optional_fields)
    |> assoc_constraint(:user)
    |> assoc_constraint(:game)
    |> unique_constraint(:game_id, name: :players_user_game_index)
    |> unique_constraint(:game_id, name: :players_position_game_index)
    |> validate_number(:score, greater_than_or_equal_to: 0)
    |> validate_number(:position, greater_than: 0)
  end
end
