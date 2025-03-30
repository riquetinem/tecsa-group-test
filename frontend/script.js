const API_URL = "http://localhost:9000/api";

function showError(message) {
    const alertContainer = $("#alert-container");
    alertContainer.text(message).removeClass("d-none");
    setTimeout(() => alertContainer.addClass("d-none"), 5000);
}

function loadTasks() {
    $.get(`${API_URL}/tasks`, function(tasks) {
        $("#task-list").empty();
        tasks.forEach(task => {
            let statusText;
            let statusClass;

            switch (task.statusId) {
                case 1:
                    statusText = task.Status.name;
                    statusClass = "text-warning";
                    break;
                case 2:
                    statusText = task.Status.name;
                    statusClass = "text-primary";
                    break;
                case 3:
                    statusText = task.Status.name;
                    statusClass = "text-success";
                    break;
                default:
                    statusText = "Desconhecido";
                    statusClass = "text-muted";
            }

            $("#task-list").append(`
                <tr data-id="${task.id}" data-statusid="${task.statusId}">
                    <td>${task.id}</td>
                    <td>${task.title}</td>
                    <td>${task.description || ""}</td>
                    <td class="${statusClass} fw-bold">${statusText}</td>
                    <td>
                        ${task.statusId === 3 
                            ? `<button class="btn btn-secondary reopen-task"><i class="fa-solid fa-rotate-left"></i></button>`
                            : `<button class="btn btn-success toggle-status"><i class="fa-solid fa-check"></i></button>`
                        }
                        <button class="btn btn-warning edit-task"><i class="fa-solid fa-pen"></i></button>
                        <button class="btn btn-danger delete-task"><i class="fa-solid fa-trash"></i></button>
                    </td>
                </tr>
            `);
        });
    }).fail(xhr => {
        console.error("Erro ao carregar tarefas:", xhr.responseText);
        showError(xhr.responseJSON?.message || "Erro ao carregar tarefas.");
    });
}


$("#task-form").submit(function(event) {
    event.preventDefault();
    const id = $("#task-id").val();
    const taskData = {
        title: $("#task-title").val().trim(),
        description: $("#task-description").val().trim(),
        statusId: $("#task-status").val(),
    };

    if (!taskData.title) {
        showError("O título da tarefa é obrigatório!");
        return;
    }

    const requestType = id ? "PUT" : "POST";
    const requestUrl = id ? `${API_URL}/tasks/${id}` : `${API_URL}/tasks`;

    $.ajax({
        url: requestUrl,
        type: requestType,
        contentType: "application/json",
        data: JSON.stringify(taskData),
        success: function () {
            loadTasks();
            $("#task-form").trigger("reset");
            $("#task-id").val("");
        },
        error: function (xhr) {
            console.error("Erro ao salvar tarefa:", xhr.responseText);
            const errorMessage = xhr.responseJSON?.message || "Erro ao salvar a tarefa.";
            showError(errorMessage);
        }
    });
});

$(document).on("click", ".edit-task", function() {
    const row = $(this).closest("tr");
    $("#task-id").val(row.data("id"));
    $("#task-title").val(row.children().eq(1).text());
    $("#task-description").val(row.children().eq(2).text());
    $("#task-status").val(row.data("statusid"));
});

$(document).on("click", ".delete-task", function() {
    const id = $(this).closest("tr").data("id");

    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    $.ajax({
        url: `${API_URL}/tasks/${id}`,
        type: "DELETE",
        success: loadTasks,
        error: function(xhr) {
            console.error("Erro ao excluir tarefa:", xhr.responseText);
            showError(xhr.responseJSON?.message || "Erro ao excluir a tarefa.");
        }
    });
});

$(document).on("click", ".toggle-status, .reopen-task", function() {
    const row = $(this).closest("tr");
    const id = row.data("id");
    const isCompleted = row.data("statusid") === 3;
    let newStatusId = isCompleted ? 1 : 3;

    $.ajax({
        url: `${API_URL}/tasks/${id}`,
        type: "PUT",
        contentType: "application/json",
        data: JSON.stringify({ statusId: newStatusId }),
        success: loadTasks,
        error: function(xhr) {
            console.error("Erro ao atualizar status:", xhr.responseText);
            showError(xhr.responseJSON?.message || "Erro ao atualizar status.");
        }
    });
});

function loadStatus() {
    $.get(`${API_URL}/status`, function(statuses) {
        const statusSelect = $("#task-status");
        statusSelect.empty(); // Limpa o select antes de adicionar novos itens

        statuses.forEach(status => {
            statusSelect.append(`<option value="${status.id}">${status.name}</option>`);
        });
    }).fail(xhr => {
        console.error("Erro ao carregar status:", xhr.responseText);
        showError(xhr.responseJSON?.message || "Erro ao carregar status.");
    });
}

$(document).ready(function() {
    loadStatus();
    loadTasks();
});


$(document).ready(loadTasks);
$(document).ready(loadStatus);
