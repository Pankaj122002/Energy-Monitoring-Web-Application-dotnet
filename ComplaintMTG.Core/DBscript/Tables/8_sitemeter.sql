USE [pe_db_complaintMGT]
GO
/****** Object:  Table [dbo].[tbl_sitemeter]    Script Date: 11/25/2025 9:41:44 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[tbl_sitemeter](
	[Sitemeterid] [int] NOT NULL,
	[Siteid] [varchar](50) NULL,
	[MeterMasterID] [int] NULL,
	[MeterDisplayname] [varchar](50) NULL,
PRIMARY KEY CLUSTERED 
(
	[Sitemeterid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
INSERT [dbo].[tbl_sitemeter] ([Sitemeterid], [Siteid], [MeterMasterID], [MeterDisplayname]) VALUES (1, N'PE Powai', 1, N'SlaveId1')
INSERT [dbo].[tbl_sitemeter] ([Sitemeterid], [Siteid], [MeterMasterID], [MeterDisplayname]) VALUES (2, N'PE Powai', 2, N'SlaveId2')
INSERT [dbo].[tbl_sitemeter] ([Sitemeterid], [Siteid], [MeterMasterID], [MeterDisplayname]) VALUES (3, N'PE Powai', 2, N'SlaveId3')
INSERT [dbo].[tbl_sitemeter] ([Sitemeterid], [Siteid], [MeterMasterID], [MeterDisplayname]) VALUES (4, N'PE Powai', 2, N'SlaveId4')
INSERT [dbo].[tbl_sitemeter] ([Sitemeterid], [Siteid], [MeterMasterID], [MeterDisplayname]) VALUES (5, N'PE Powai', 2, N'SlaveId5')
INSERT [dbo].[tbl_sitemeter] ([Sitemeterid], [Siteid], [MeterMasterID], [MeterDisplayname]) VALUES (6, N'PE Powai', 2, N'SlaveId6')
INSERT [dbo].[tbl_sitemeter] ([Sitemeterid], [Siteid], [MeterMasterID], [MeterDisplayname]) VALUES (7, N'PE Powai', 2, N'SlaveId7')
INSERT [dbo].[tbl_sitemeter] ([Sitemeterid], [Siteid], [MeterMasterID], [MeterDisplayname]) VALUES (8, N'PE Powai', 2, N'SlaveId8')
GO
ALTER TABLE [dbo].[tbl_sitemeter]  WITH NOCHECK ADD  CONSTRAINT [FK_tbl_sitemeter_tbl_MeterMaster] FOREIGN KEY([MeterMasterID])
REFERENCES [dbo].[tbl_MeterMaster] ([MeterMasterID])
GO
ALTER TABLE [dbo].[tbl_sitemeter] CHECK CONSTRAINT [FK_tbl_sitemeter_tbl_MeterMaster]
GO
