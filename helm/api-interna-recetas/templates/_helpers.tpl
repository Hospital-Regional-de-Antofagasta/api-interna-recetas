{{/*
Expand the name of the chart.
*/}}
{{- define "api-configuracion-hrapp.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
We truncate at 63 chars because some Kubernetes name fields are limited to this (by the DNS naming spec).
If release name contains chart name it will be used as a full name.
*/}}
{{- define "api-configuracion-hrapp.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Define default name for secrets
*/}}
{{- define "api-configuracion-hrapp.secrets" -}}
{{- include "api-configuracion-hrapp.fullname" . | printf "%s-secrets" }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "api-configuracion-hrapp.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "api-configuracion-hrapp.labels" -}}
helm.sh/chart: {{ include "api-configuracion-hrapp.chart" . }}
{{ include "api-configuracion-hrapp.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "api-configuracion-hrapp.selectorLabels" -}}
app.kubernetes.io/name: {{ include "api-configuracion-hrapp.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}


