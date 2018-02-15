// Package model holds the various types and interfaces for Parrot.
package model

type Locale struct {
	Code     LocaleCode `json:"code"`
	Language string     `json:"language"`
	Country  string     `json:"country"`
}

type Project struct {
	ID           ProjectID `json:"id"`
	Name         string    `json:"name"`
	Keys         []Key     `json:"keys"`
	Translations map[LocaleCode]ProjectTranslation
}

type ProjectID string

type LocaleCode string

type Key string

type Translation string

type ProjectTranslation struct {
	LocaleCode LocaleCode          `json:"localeCode"`
	Pairs      map[Key]Translation `json:"pairs"`
}

type User struct {
	Name     string `db:"name" json:"name,omitempty"`
	Email    string `db:"email" json:"email,omitempty"`
	Password string `db:"password" json:"password,omitempty"`
}

type ProjectUser struct {
	Name  string `db:"name" json:"name,omitempty"`
	Email string `db:"email" json:"email,omitempty"`
	Role  string `db:"role" json:"role,omitempty"`
}

type ProjectClient struct {
	ClientID string `json:"client_id"`
	Name     string `json:"name"`
	Secret   string `json:"secret,omitempty"`
}

// LocaleStorer is the interface to store locales.
type LocaleStorer interface {
	GetLocale(code string) (*Locale, error)
}

// ProjectStorer is the interface to store projects.
type ProjectStorer interface {
	GetProject(ProjectID) (*Project, error)
	CreateProject(Project) (*Project, error)
	UpdateProject(Project) (*Project, error)
	DeleteProject(ProjectID) error
	UpdateProjectName(projectID ProjectID, name string) (*Project, error)
	AddProjectKey(projectID ProjectID, key Key) (*Project, error)
	UpdateProjectKey(projectID ProjectID, oldKey, newKey Key) (*Project, int, error)
	DeleteProjectKey(projectID ProjectID, key Key) (*Project, error)
}

// ProjectTranslationStorer is the interface to store project translations.
type ProjectTranslationStorer interface {
	UpdateKeyTranslation(projectID string, key Key, translation string) (*string, error)
	GetProjectTranslation(projectID string, localeCode LocaleCode) (*ProjectTranslation, error)
	GetProjectAvailableLocales(projectID string) ([]LocaleCode, error)
}

// ProjectClientStorer is the interface to store project clients.
type ProjectClientStorer interface {
	GetProjectClients(ProjectID) ([]ProjectClient, error)
	GetProjectClient(projectID string, clientID string) (*ProjectClient, error)
	CreateProjectClient(ProjectClient) (*ProjectClient, error)
	UpdateProjectClientSecret(cliendID, secret string) (*ProjectClient, error)
	UpdateProjectClientName(clientID, newName string) (*ProjectClient, error)
	DeleteProjectClient(projectID string, clientID string) error
}

// UserStorer is the interface to store users.
type UserStorer interface {
	GetUserByID(string) (*User, error)
	GetUserByEmail(string) (*User, error)
	CreateUser(name, email, password string) (*User, error)
	UpdateUserPassword(userID, newPassword string) (*User, error)
	UpdateUserName(userID, newName string) (*User, error)
	UpdateUserEmail(userID, newEmail string) (*User, error)
}

// ProjectUserStorer is the interface to store project users.
type ProjectUserStorer interface {
	GetProjectUsers(projectID string) ([]ProjectUser, error)
	GetUserProjects(userID string) ([]Project, error)
	GetProjectUser(projectID, userID string) (*ProjectUser, error)
	AssignProjectUser(userID, role string) (*ProjectUser, error)
	RevokeProjectUser(projectID, userID string) error
	UpdateProjectUser(projectID, userID, newRole string) (*ProjectUser, error)
}
