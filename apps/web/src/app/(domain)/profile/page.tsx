"use client"

import type React from "react"

import { useState } from "react"
import {
	MailIcon,
	EditIcon,
	CameraIcon,
	LockIcon,
	LogOutIcon,
	ActivityIcon,
	SaveIcon,
	XIcon,
	ShieldIcon,
	ClockIcon,
	FileTextIcon,
	SettingsIcon,
	ZapIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog"
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import ChangePasswordDialog from "@/components/change-password-dialog"

// Mock user data
const mockUser = {
	id: "clx123456789",
	name: "María González",
	email: "maria.gonzalez@ejemplo.com",
	emailVerified: true,
	image: "/placeholder.svg?height=120&width=120",
	provider: "local",
	loggedAt: "2024-01-30T15:30:00Z",
	role: "authenticated",
	createdAt: "2024-01-15T10:00:00Z",
	updatedAt: "2024-01-30T15:30:00Z",
	biography:
		"Especialista en análisis de datos y detección de sesgos. Apasionada por la inteligencia artificial ética y el procesamiento de lenguaje natural.",
}

// Mock recent activities
const mockActivities = [
	{
		id: "1",
		type: "analysis",
		title: "Análisis de Artículo Científico",
		description:
			"Completado análisis de sesgo de género en documento académico",
		timestamp: "2024-01-30T14:20:00Z",
		status: "completed",
	},
	{
		id: "2",
		type: "preset",
		title: "Nuevo Preset Creado",
		description: "Preset 'Análisis Académico' configurado con 2 modelos",
		timestamp: "2024-01-30T10:15:00Z",
	},
	{
		id: "3",
		type: "model",
		title: "Modelo GPT-4 Actualizado",
		description: "Configuración de parámetros modificada",
		timestamp: "2024-01-29T16:45:00Z",
	},
	{
		id: "4",
		type: "analysis",
		title: "Análisis de Política Interna",
		description: "Análisis completado con 3 sesgos detectados",
		timestamp: "2024-01-29T12:30:00Z",
		status: "completed",
	},
	{
		id: "5",
		type: "analysis",
		title: "Análisis de Documento Legal",
		description: "Error en procesamiento - formato no compatible",
		timestamp: "2024-01-28T09:15:00Z",
		status: "failed",
	},
]

export default function ProfilePage() {
	const [user, setUser] = useState(mockUser)
	const [isEditing, setIsEditing] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [editForm, setEditForm] = useState({
		name: user.name,
		biography: user.biography || "",
	})
	const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false)
	const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false)

	const handleSaveProfile = async () => {
		setIsLoading(true)

		// Simulate API call
		setTimeout(() => {
			setUser({
				...user,
				name: editForm.name,
				biography: editForm.biography,
				updatedAt: new Date().toISOString(),
			})
			setIsEditing(false)
			setIsLoading(false)
		}, 1500)
	}

	const handleCancelEdit = () => {
		setEditForm({
			name: user.name,
			biography: user.biography || "",
		})
		setIsEditing(false)
	}

	const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			// In a real app, you would upload to a service like Cloudinary or AWS S3
			const reader = new FileReader()
			reader.onload = (e) => {
				setUser({
					...user,
					image: e.target?.result as string,
					updatedAt: new Date().toISOString(),
				})
			}
			reader.readAsDataURL(file)
		}
	}

	const handleLogout = () => {
		console.log("Logging out...")
		// Handle logout logic here
		setIsLogoutDialogOpen(false)
	}

	const getRoleColor = (role: string) => {
		switch (role) {
			case "superadmin":
				return "bg-purple-100 text-purple-800"
			case "admin":
				return "bg-blue-100 text-blue-800"
			default:
				return "bg-green-100 text-green-800"
		}
	}

	const getRoleLabel = (role: string) => {
		switch (role) {
			case "superadmin":
				return "Super Administrador"
			case "admin":
				return "Administrador"
			default:
				return "Usuario"
		}
	}

	const getProviderLabel = (provider: string) => {
		switch (provider) {
			case "google":
				return "Google"
			case "github":
				return "GitHub"
			default:
				return "Email"
		}
	}

	const getActivityIcon = (type: string) => {
		switch (type) {
			case "analysis":
				return <FileTextIcon className="h-4 w-4" />
			case "model":
				return <SettingsIcon className="h-4 w-4" />
			case "preset":
				return <ZapIcon className="h-4 w-4" />
			default:
				return <ActivityIcon className="h-4 w-4" />
		}
	}

	const getActivityColor = (type: string, status?: string) => {
		if (status === "failed") return "text-red-600"
		if (status === "running") return "text-blue-600"

		switch (type) {
			case "analysis":
				return "text-green-600"
			case "model":
				return "text-purple-600"
			case "preset":
				return "text-orange-600"
			default:
				return "text-gray-600"
		}
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("es-ES", {
			year: "numeric",
			month: "long",
			day: "numeric",
		})
	}

	const formatDateTime = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("es-ES", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		})
	}

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			<div className="container mx-auto px-4 py-8">
				{/* Header */}
				<div className="mb-8">
					<h1 className="mb-2 text-3xl font-bold text-gray-900">
						Mi Perfil
					</h1>
					<p className="text-gray-600">
						Gestiona tu información personal y configuraciones de
						cuenta
					</p>
				</div>

				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					{/* Profile Card */}
					<div className="lg:col-span-1">
						<Card className="sticky top-8">
							<CardHeader className="pb-4 text-center">
								<div className="relative mx-auto mb-4">
									<Avatar className="mx-auto h-24 w-24">
										<AvatarImage
											src={
												user.image || "/placeholder.svg"
											}
											alt={user.name}
										/>
										<AvatarFallback className="bg-blue-100 text-lg font-semibold text-blue-600">
											{getInitials(user.name)}
										</AvatarFallback>
									</Avatar>
									<Dialog>
										<DialogTrigger asChild>
											<Button
												size="sm"
												className="absolute -right-2 -bottom-2 h-8 w-8 rounded-full bg-blue-600 p-0 hover:bg-blue-700"
											>
												<CameraIcon className="h-4 w-4" />
											</Button>
										</DialogTrigger>
										<DialogContent className="sm:max-w-md">
											<DialogHeader>
												<DialogTitle>
													Cambiar Foto de Perfil
												</DialogTitle>
												<DialogDescription>
													Selecciona una nueva imagen
													para tu perfil
												</DialogDescription>
											</DialogHeader>
											<div className="space-y-4">
												<div className="flex justify-center">
													<Avatar className="h-32 w-32">
														<AvatarImage
															src={
																user.image ||
																"/placeholder.svg"
															}
															alt={user.name}
														/>
														<AvatarFallback className="bg-blue-100 text-2xl font-semibold text-blue-600">
															{getInitials(
																user.name,
															)}
														</AvatarFallback>
													</Avatar>
												</div>
												<div className="space-y-2">
													<Label htmlFor="image-upload">
														Seleccionar Imagen
													</Label>
													<Input
														id="image-upload"
														type="file"
														accept="image/*"
														onChange={
															handleImageUpload
														}
														className="cursor-pointer"
													/>
													<p className="text-xs text-gray-500">
														Formatos soportados:
														JPG, PNG, GIF. Tamaño
														máximo: 5MB
													</p>
												</div>
											</div>
										</DialogContent>
									</Dialog>
								</div>

								<CardTitle className="text-xl">
									{user.name}
								</CardTitle>
								<CardDescription className="flex items-center justify-center gap-2">
									<MailIcon className="h-4 w-4" />
									{user.email}
									{user.emailVerified && (
										<Badge
											variant="outline"
											className="border-green-200 bg-green-50 text-green-700"
										>
											Verificado
										</Badge>
									)}
								</CardDescription>
							</CardHeader>

							<CardContent className="space-y-4">
								<div className="space-y-3">
									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-600">
											Rol
										</span>
										<Badge
											className={getRoleColor(user.role)}
										>
											<ShieldIcon className="mr-1 h-3 w-3" />
											{getRoleLabel(user.role)}
										</Badge>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-600">
											Proveedor
										</span>
										<span className="text-sm font-medium">
											{getProviderLabel(user.provider)}
										</span>
									</div>

									<div className="flex items-center justify-between">
										<span className="text-sm text-gray-600">
											Miembro desde
										</span>
										<span className="text-sm font-medium">
											{formatDate(user.createdAt)}
										</span>
									</div>

									{user.loggedAt && (
										<div className="flex items-center justify-between">
											<span className="text-sm text-gray-600">
												Último acceso
											</span>
											<span className="text-sm font-medium">
												{formatDateTime(user.loggedAt)}
											</span>
										</div>
									)}
								</div>

								<Separator />

								<div className="space-y-2">
									<Button
										onClick={() =>
											setIsChangePasswordOpen(true)
										}
										variant="outline"
										className="w-full justify-start gap-2 bg-transparent"
									>
										<LockIcon className="h-4 w-4" />
										Cambiar Contraseña
									</Button>

									<AlertDialog
										open={isLogoutDialogOpen}
										onOpenChange={setIsLogoutDialogOpen}
									>
										<AlertDialogTrigger asChild>
											<Button
												variant="outline"
												className="w-full justify-start gap-2 bg-transparent text-red-600 hover:bg-red-50 hover:text-red-700"
											>
												<LogOutIcon className="h-4 w-4" />
												Cerrar Sesión
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>
													¿Cerrar Sesión?
												</AlertDialogTitle>
												<AlertDialogDescription>
													¿Estás seguro de que quieres
													cerrar tu sesión? Tendrás
													que volver a iniciar sesión
													para acceder a tu cuenta.
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>
													Cancelar
												</AlertDialogCancel>
												<AlertDialogAction
													onClick={handleLogout}
													className="bg-red-600 hover:bg-red-700"
												>
													Cerrar Sesión
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Main Content */}
					<div className="lg:col-span-2">
						<Tabs defaultValue="profile" className="space-y-6">
							<TabsList className="grid w-full grid-cols-2">
								<TabsTrigger value="profile">
									Información Personal
								</TabsTrigger>
								<TabsTrigger value="activity">
									Actividad Reciente
								</TabsTrigger>
							</TabsList>

							{/* Profile Tab */}
							<TabsContent value="profile" className="space-y-6">
								<Card>
									<CardHeader>
										<div className="flex items-center justify-between">
											<div>
												<CardTitle>
													Información Personal
												</CardTitle>
												<CardDescription>
													Actualiza tu información
													personal y biografía
												</CardDescription>
											</div>
											{!isEditing && (
												<Button
													onClick={() =>
														setIsEditing(true)
													}
													variant="outline"
													size="sm"
													className="gap-2 bg-transparent"
												>
													<EditIcon className="h-4 w-4" />
													Editar
												</Button>
											)}
										</div>
									</CardHeader>

									<CardContent className="space-y-6">
										{isEditing ? (
											<div className="space-y-4">
												<div className="space-y-2">
													<Label htmlFor="name">
														Nombre Completo
													</Label>
													<Input
														id="name"
														value={editForm.name}
														onChange={(e) =>
															setEditForm({
																...editForm,
																name: e.target
																	.value,
															})
														}
														placeholder="Tu nombre completo"
													/>
												</div>

												<div className="space-y-2">
													<Label htmlFor="email">
														Correo Electrónico
													</Label>
													<Input
														id="email"
														value={user.email}
														disabled
														className="bg-gray-50 text-gray-500"
													/>
													<p className="text-xs text-gray-500">
														El correo electrónico no
														se puede modificar
													</p>
												</div>

												<div className="space-y-2">
													<Label htmlFor="biography">
														Biografía
													</Label>
													<Textarea
														id="biography"
														value={
															editForm.biography
														}
														onChange={(e) =>
															setEditForm({
																...editForm,
																biography:
																	e.target
																		.value,
															})
														}
														placeholder="Cuéntanos un poco sobre ti..."
														rows={4}
														maxLength={500}
													/>
													<p className="text-xs text-gray-500">
														{
															editForm.biography
																.length
														}
														/500 caracteres
													</p>
												</div>

												<div className="flex gap-3 pt-4">
													<Button
														onClick={
															handleSaveProfile
														}
														disabled={isLoading}
														className="gap-2"
													>
														{isLoading ? (
															<>
																<div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
																Guardando...
															</>
														) : (
															<>
																<SaveIcon className="h-4 w-4" />
																Guardar Cambios
															</>
														)}
													</Button>
													<Button
														onClick={
															handleCancelEdit
														}
														variant="outline"
														className="gap-2 bg-transparent"
													>
														<XIcon className="h-4 w-4" />
														Cancelar
													</Button>
												</div>
											</div>
										) : (
											<div className="space-y-4">
												<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
													<div className="space-y-2">
														<Label className="text-sm font-medium text-gray-700">
															Nombre Completo
														</Label>
														<p className="text-gray-900">
															{user.name}
														</p>
													</div>

													<div className="space-y-2">
														<Label className="text-sm font-medium text-gray-700">
															Correo Electrónico
														</Label>
														<p className="text-gray-900">
															{user.email}
														</p>
													</div>

													<div className="space-y-2">
														<Label className="text-sm font-medium text-gray-700">
															Fecha de Registro
														</Label>
														<p className="text-gray-900">
															{formatDate(
																user.createdAt,
															)}
														</p>
													</div>

													<div className="space-y-2">
														<Label className="text-sm font-medium text-gray-700">
															Última Actualización
														</Label>
														<p className="text-gray-900">
															{formatDateTime(
																user.updatedAt,
															)}
														</p>
													</div>
												</div>

												{user.biography && (
													<div className="space-y-2">
														<Label className="text-sm font-medium text-gray-700">
															Biografía
														</Label>
														<div className="rounded-lg bg-gray-50 p-4">
															<p className="leading-relaxed text-gray-900">
																{user.biography}
															</p>
														</div>
													</div>
												)}
											</div>
										)}
									</CardContent>
								</Card>
							</TabsContent>

							{/* Activity Tab */}
							<TabsContent value="activity" className="space-y-6">
								<Card>
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<ActivityIcon className="h-5 w-5" />
											Actividad Reciente
										</CardTitle>
										<CardDescription>
											Tus últimas acciones en la
											plataforma
										</CardDescription>
									</CardHeader>

									<CardContent>
										<div className="space-y-4">
											{mockActivities.map(
												(activity, index) => (
													<div
														key={activity.id}
														className="flex items-start gap-4 border-b border-gray-100 pb-4 last:border-0"
													>
														<div
															className={`rounded-lg p-2 ${getActivityColor(activity.type, activity.status)} bg-opacity-10`}
														>
															{getActivityIcon(
																activity.type,
															)}
														</div>

														<div className="min-w-0 flex-1">
															<div className="flex items-center justify-between">
																<h4 className="truncate font-medium text-gray-900">
																	{
																		activity.title
																	}
																</h4>
																<div className="flex items-center gap-2 text-xs text-gray-500">
																	<ClockIcon className="h-3 w-3" />
																	{formatDateTime(
																		activity.timestamp,
																	)}
																</div>
															</div>
															<p className="mt-1 text-sm text-gray-600">
																{
																	activity.description
																}
															</p>
															{activity.status && (
																<Badge
																	variant="outline"
																	className={`mt-2 ${
																		activity.status ===
																		"completed"
																			? "border-green-200 bg-green-50 text-green-700"
																			: activity.status ===
																				  "failed"
																				? "border-red-200 bg-red-50 text-red-700"
																				: "border-blue-200 bg-blue-50 text-blue-700"
																	}`}
																>
																	{activity.status ===
																		"completed" &&
																		"Completado"}
																	{activity.status ===
																		"failed" &&
																		"Error"}
																	{activity.status ===
																		"running" &&
																		"En Progreso"}
																</Badge>
															)}
														</div>
													</div>
												),
											)}
										</div>

										{mockActivities.length === 0 && (
											<div className="py-8 text-center">
												<ActivityIcon className="mx-auto mb-4 h-12 w-12 text-gray-400" />
												<h3 className="mb-2 text-lg font-medium text-gray-900">
													No hay actividad reciente
												</h3>
												<p className="text-gray-600">
													Tus acciones aparecerán aquí
													una vez que comiences a usar
													la plataforma
												</p>
											</div>
										)}
									</CardContent>
								</Card>
							</TabsContent>
						</Tabs>
					</div>
				</div>

				{/* Change Password Dialog */}
				<ChangePasswordDialog
					open={isChangePasswordOpen}
					onOpenChange={setIsChangePasswordOpen}
				/>
			</div>
		</div>
	)
}
